import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class AppController {
  /**
   * Retrieves the status of the application.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise} A Promise that resolves with the status of the application.
   */
  static async getStatus(req, res) {
    // Check if the Redis client is alive.
    const redisLive = redisClient.isAlive();

    // Check if the MongoDB client is alive.
    const dbLive = dbClient.isAlive();

    // Send the status as a JSON response.
    res.status(200).json({ redis: redisLive, db: dbLive });
  }

  /**
   * Retrieves statistics about the number of users and files in the database.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise} A Promise that resolves with the statistics.
   */
  static async getStats(req, res) {
    // Retrieve the total number of users from the database.
    const usersTotal = await dbClient.nbUsers();

    // Retrieve the total number of files from the database.
    const filesTotal = await dbClient.nbFiles();

    // Send the statistics as a JSON response with a 200 status code.
    res.status(200).json({ users: usersTotal, files: filesTotal });
  }
}

export default AppController;
