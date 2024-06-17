const { MongoClient } = require('mongodb');

class DBClient {
  /**
   * Constructs a new instance of the DBClient class.
   * This class represents a client for interacting with a MongoDB database.
   * It connects to the specified database using the provided host, port, and database name.
   * If these values are not provided, it defaults to using localhost, port 27017, and the database name 'files_manager'.
   * The connection is established using the provided URL.
   */
  constructor() {
    // Retrieve the database host from the environment variables.
    // If not provided, default to 'localhost'.
    const host = process.env.DB_HOST || 'localhost';

    // Retrieve the database port from the environment variables.
    // If not provided, default to 27017.
    const port = process.env.DB_PORT || 27017;

    // Retrieve the database name from the environment variables.
    // If not provided, default to 'files_manager'.
    const database = process.env.DB_DATABASE || 'files_manager';

    // Construct the MongoDB connection URL using the provided host, port, and database name.
    const url = `mongodb://${host}:${port}/${database}`;

    // Create a new instance of the MongoClient class, passing in the connection URL.
    this.client = new MongoClient(url);

    // Establish a connection to the MongoDB database.
    this.client.connect();
  }

  /**
   * Checks if the client is alive by verifying the connection to the MongoDB database.
   *
   * @return {boolean} Returns true if the client is connected to the MongoDB database, false otherwise.
   */
  isAlive() {
    // Check if the client is connected to the MongoDB database.
    // Returns true if the client is connected, false otherwise.
    return this.client.isConnected();
  }

  /**
   * Retrieves the number of users in the 'users' collection of the MongoDB database.
   *
   * @return {Promise<number>} A Promise that resolves to the number of users in the collection.
   */
  async nbUsers() {
    // Retrieve the 'users' collection from the MongoDB database.
    const collection = this.client.db().collection('users');

    // Count the number of documents in the collection.
    return collection.countDocuments();
  }

  /**
   * Retrieves the number of files in the 'files' collection of the MongoDB database.
   *
   * @return {Promise<number>} A Promise that resolves to the number of files in the collection.
   */
  async nbFiles() {
    // Retrieve the 'files' collection from the MongoDB database.
    const collection = this.client.db().collection('files');

    // Count the number of documents in the collection.
    return collection.countDocuments();
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
