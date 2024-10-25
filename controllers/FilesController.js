// controllers/FilesController.js
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class FilesController {
  static async postUpload(req, res) {
    const token = req.header('X-Token');
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { name, type, parentId, isPublic = false, data } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Missing name' });
    }
    if (!type || !['folder', 'file', 'image'].includes(type)) {
      return res.status(400).json({ error: 'Missing type' });
    }
    if (type !== 'folder' && !data) {
      return res.status(400).json({ error: 'Missing data' });
    }

    let parentFile;
    if (parentId) {
      parentFile = await dbClient.filesCollection().findOne({ _id: new dbClient.ObjectId(parentId) });
      if (!parentFile) {
        return res.status(400).json({ error: 'Parent not found' });
      }
      if (parentFile.type !== 'folder') {
        return res.status(400).json({ error: 'Parent is not a folder' });
      }
    }

    const fileDocument = {
      userId: new dbClient.ObjectId(userId),
      name,
      type,
      isPublic,
      parentId: parentId ? new dbClient.ObjectId(parentId) : 0,
    };

    if (type === 'folder') {
      const newFile = await dbClient.filesCollection().insertOne(fileDocument);
      return res.status(201).json({ id: newFile.insertedId, ...fileDocument });
    }

    // Prepare to store file
    const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';
    const fileId = uuidv4(); // Generate UUID for the file name
    const filePath = path.join(folderPath, fileId);

    // Create directory if it doesn't exist
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // Decode base64 data and write to file
    const buffer = Buffer.from(data, 'base64');
    fs.writeFileSync(filePath, buffer);

    // Store file information in DB
    fileDocument.localPath = filePath;
    const newFile = await dbClient.filesCollection().insertOne(fileDocument);

    return res.status(201).json({ id: newFile.insertedId, ...fileDocument });
  }
}

module.exports = FilesController;
