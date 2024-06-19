import sha1 from 'sha1';
import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';
import { userQueue } from '../worker';

class UsersController {
  /**
   * Creates a new user in the database.
   *
   * @param {Object} req - The request object containing the user's email and password.
   * @param {Object} res - The response object to send the result back to the client.
   * @returns {Promise<Object>} The created user object containing the id and email.
   */
  static async postNew(req, res) {
    // Extract the email and password from the request body.
    const { email, password } = req.body;

    // Check if email and password are provided.
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    // Check if the user already exists in the database.
    const userExists = await dbClient.dbClient.collection('users').findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'Already exist' });
    }

    // Hash the password using SHA-1.
    const hashedPassword = sha1(password);

    // Insert the user into the database.
    const result = await dbClient.dbClient.collection('users').insertOne({ email, password: hashedPassword });

    // Add the user to the queue for further processing.
    userQueue.add({ userId: result.insertedId });

    // Return the created user object.
    return res.status(201).json({ id: result.insertedId, email });
  }

  /**
   * Retrieves the details of the authenticated user.
   *
   * @param {Object} req - The request object containing the authentication token.
   * @param {Object} res - The response object to send the user details back to the client.
   * @returns {Promise<Object>} - A promise that resolves to the response object with the user details.
   */
  static async getMe(req, res) {
    // Extract the authentication token from the request headers.
    const token = req.header('X-Token');

    // If no token is provided, return an unauthorized error.
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Retrieve the user ID associated with the token from Redis.
    const userId = await redisClient.get(`auth_${token}`);

    // If the user ID is not found, return an unauthorized error.
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Retrieve the user details from the database.
    const users = await dbClient.dbClient.collection('users');
    const ObjId = new ObjectId(userId);

    const user = await users.findOne({ _id: ObjId });

    // If the user is found, return the user details.
    if (user) {
      return res.status(200).json({ id: userId, email: user.email });
    }

    // If the user is not found, return an unauthorized error.
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

export default UsersController;
