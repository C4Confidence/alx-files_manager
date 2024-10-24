import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AppController {
  // GET /status
  static getStatus(req, res) {
    res.status(200).json({
      redis: redisClient.isAlive(),
      db: dbClient.isAlive(),
    });
  }

  // GET /stats
  static async getStats(req, res) {
    try {
      const usersCount = await dbClient.nbUsers();
      const filesCount = await dbClient.nbFiles();
      res.status(200).json({
        users: usersCount,
        files: filesCount,
      });
    } catch (err) {
      res.status(500).json({ error: 'Unable to retrieve stats' });
    }
  }
}

export default AppController;
