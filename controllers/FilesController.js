// controllers/FilesController.js
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class FilesController {
  static async postUpload(req, res) {
    // Existing implementation...
  }

  static async getShow(req, res) {
    const token = req.header('X-Token');
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const file = await dbClient.filesCollection().findOne({ _id: new dbClient.ObjectId(id), userId: new dbClient.ObjectId(userId) });

    if (!file) {
      return res.status(404).json({ error: 'Not found' });
    }

    return res.status(200).json(file);
  }

  static async getIndex(req, res) {
    const token = req.header('X-Token');
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { parentId = 0, page = 0 } = req.query;
    const limit = 20;
    const skip = page * limit;

    const files = await dbClient.filesCollection().aggregate([
      { $match: { parentId: parseInt(parentId), userId: new dbClient.ObjectId(userId) } },
      { $skip: skip },
      { $limit: limit },
    ]).toArray();

    return res.status(200).json(files);
  }
}

module.exports = FilesController;
