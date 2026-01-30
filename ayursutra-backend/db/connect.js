const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config(); // Loads variables from .env file

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.log('⚠️  MONGODB_URI not found in environment variables');
  console.log('📝 Please check your config.env file and ensure MONGODB_URI is set correctly');
  console.log('🔗 You can get your MongoDB Atlas connection string from your Atlas dashboard');
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let database;

const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas successfully!');
    database = client.db(); // This uses the database specified in the URI (ayursutra_db)
    return database;
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    console.log('🔧 Troubleshooting tips:');
    console.log('   1. Check your MongoDB Atlas username and password');
    console.log('   2. Ensure your IP address is whitelisted in Atlas');
    console.log('   3. Verify the cluster is running');
    console.log('   4. Check if the database user has the correct permissions');
    process.exit(1); // Stop the server if connection fails
  }
};

const getDatabase = () => {
  if (!database) {
    throw new Error('Database not connected!');
  }
  return database;
};

const getClient = () => {
  if (!client) {
    throw new Error('MongoDB client not connected!');
  }
  return client;
};

module.exports = { connectToDatabase, getDatabase, getClient };
