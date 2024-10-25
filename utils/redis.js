// utils/redis.js
const redis = require('redis');
const client = redis.createClient();

class RedisClient {
  isAlive() {
    return client.connected;
  }
}

module.exports = new RedisClient();
