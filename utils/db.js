// utils/db.js
const { MongoClient } = require('mongodb');

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    
    const uri = `mongodb://${host}:${port}/${database}`;
    this.client = new MongoClient(uri, { useUnifiedTopology: true });
    this.database = database;

    // Connect to the database
    this.client.connect().catch(err => {
      console.error('Failed to connect to MongoDB:', err);
    });
  }

  async isAlive() {
    try {
      await this.client.connect();
      return this.client.isConnected();
    } catch {
      return false;
    }
  }

  async nbUsers() {
    try {
      const db = this.client.db(this.database);
      return await db.collection('users').countDocuments();
    } catch (err) {
      console.error('Error counting users:', err);
      return 0;
    }
  }

  async nbFiles() {
    try {
      const db = this.client.db(this.database);
      return await db.collection('files').countDocuments();
    } catch (err) {
      console.error('Error counting files:', err);
      return 0;
    }
  }

  // New method to get the users collection
  usersCollection() {
    return this.client.db(this.database).collection('users');
  }
}

// Create and export an instance of DBClient
const dbClient = new DBClient();
module.exports = dbClient;
