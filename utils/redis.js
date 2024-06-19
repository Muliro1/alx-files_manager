const redis = require('redis');

class RedisClient {
  /**
   * Creates a new Redis client instance and sets up an error listener.
   *
   * @constructor
   */
  constructor() {
    // Create a new Redis client instance
    this.client = redis.createClient();

    /**
     * Logs any errors that occur in the Redis client.
     *
     * @param {Error} error - The error that occurred.
     */
    this.client.on('error', (error) => {
      // Log the error
      console.error(error);
    });
  }

  /**
   * Checks if the Redis client is alive and connected.
   *
   * @return {boolean} Returns true if the Redis client is connected, false otherwise.
   */
  isAlive() {
    // Check if the Redis client is connected
    return this.client.connected;
  }

  /**
   * Retrieves the value associated with the specified key from Redis.
   *
   * @param {string} key - The key to retrieve the value for.
   * @return {Promise} A promise that resolves with the value associated with the key, or rejects with an error if the retrieval fails.
   */
  async get(key) {
    return new Promise((resolve, reject) => {
      // Retrieve the value associated with the specified key from Redis
      this.client.get(key, (error, reply) => {
        if (error) {
          // If there is an error, reject the promise with the error
          reject(error);
        } else {
          // If the retrieval is successful, resolve the promise with the value
          resolve(reply);
        }
      });
    });
  }

  /**
   * Sets the value associated with the specified key in Redis.
   *
   * @param {string} key - The key to set the value for.
   * @param {string} value - The value to set.
   * @param {number} duration - The duration in seconds for which the value should be stored.
   * @return {Promise} A promise that resolves with the reply from Redis, or rejects with an error if the setting fails.
   */
  async set(key, value, duration) {
    return new Promise((resolve, reject) => {
      // Set the value associated with the specified key in Redis with the specified duration
      this.client.set(key, value, 'EX', duration, (error, reply) => {
        if (error) {
          // If there is an error, reject the promise with the error
          reject(error);
        } else {
          // If the setting is successful, resolve the promise with the reply from Redis
          resolve(reply);
        }
      });
    });
    // Set the value associated with the specified key in Redis with the specified duration
    //
    // @param {string} key - The key to set the value for.
    // @param {string} value - The value to set.
    // @param {number} duration - The duration in seconds for which the value should be stored.
    // @return {Promise} A promise that resolves with the reply from Redis, or rejects with an error if the setting fails.
  }

  /**
   * Deletes the value associated with the specified key in Redis.
   *
   * @param {string} key - The key to delete the value for.
   * @return {Promise} A promise that resolves with the number of keys deleted, or rejects with an error if the deletion fails.
   */
  async del(key) {
    return new Promise((resolve, reject) => {
      // Delete the value associated with the specified key in Redis
      this.client.del(key, (error, reply) => {
        if (error) {
          // If there is an error, reject the promise with the error
          reject(error);
        } else {
          // If the deletion is successful, resolve the promise with the number of keys deleted
          resolve(reply);
        }
      });
    });
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;
