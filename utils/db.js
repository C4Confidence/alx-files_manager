// utils/db.js
const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_URI; // Make sure to set this in your environment variables
const client = new MongoClient(uri, { useUnifiedTopology: true });

class DBClient {
  async isAlive() {
    if (!client.isConnected()) {
      await client.connect();
    }
    return client.isConnected();
  }

  async nbUsers() {
    return client.db().collection('users').countDocuments();
  }

  async nbFiles() {
    return client.db().collection('files').countDocuments();
  }
}

module.exports = new DBClient();
