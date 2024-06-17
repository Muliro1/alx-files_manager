import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class AuthController {
  /**
   * Authenticates a user by checking their email and password against the database.
   * If the user is found and the password is correct, a token is generated and stored in Redis.
   * The token is then sent back to the client.
   *
   * @param {Object} req - The request object containing the user's credentials.
   * @param {Object} res - The response object to send the token back to the client.
   * @returns {Promise<Object>} - A promise that resolves to the response object with the token.
   */
  static async getConnect(req, res) {
    // Extract the encoded credentials from the authorization header
    const credEnc = req.header('Authorization').split(' ')[1];
    // Decode the credentials and split them into email and password
    const [email, password] = Buffer.from(credEnc, 'base64').toString('ascii').split(':');
    
    // Check if email and password are provided
    if (!email || !password) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Find the user in the database by email and compare the password
    const user = await dbClient.dbClient.collection('users').findOne({ email, password: sha1(password) });
    
    // Check if the user is found and the password is correct
    if (!user || user.password !== sha1(password)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Generate a token and store it in Redis with an expiration time of 24 hours
    const token = uuidv4();
    await redisClient.set(`auth_${token}`, user._id.toString(), 60 * 60 * 24);

    // Send the token back to the client
    return res.status(200).json({ token });
  }

  /**
   * Disconnects a user by removing their token from Redis.
   *
   * @param {Object} req - The request object containing the user's token.
   * @param {Object} res - The response object indicating success or failure.
   * @returns {Promise<Object>} - A promise that resolves to the response object.
   */
  static async getDisconnect(req, res) {
    // Extract the token from the request headers
    const token = req.header('X-Token');

    // Get the user ID associated with the token from Redis
    const userId = await redisClient.get(`auth_${token}`);

    // If the user ID is not found, return an error
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Remove the token from Redis
    await redisClient.del(`auth_${token}`);

    // Return a response with no content
    return res.status(204).end(); // end will make ;à send empty body, 204 mean no content
  }
}

export default AuthController;
