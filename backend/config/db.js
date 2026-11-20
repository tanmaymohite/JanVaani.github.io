const mongoose = require('mongoose');

// In-memory mock database (development only — never used in production)
const mockDb = {
  complaints: []
};

let isMockMode = false;

const connectDB = async () => {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const mongoURI = process.env.MONGO_URI;

  // Guard: reject localhost URI in production
  if (nodeEnv === 'production') {
    if (!mongoURI) {
      throw new Error(
        'MONGO_URI environment variable is not set. ' +
        'Configure it in the Render dashboard under Environment Variables.'
      );
    }
    if (mongoURI.includes('localhost') || mongoURI.includes('127.0.0.1')) {
      throw new Error(
        'MONGO_URI points to localhost but NODE_ENV is production. ' +
        'Set the MongoDB Atlas SRV URI in Render Environment Variables.'
      );
    }
  }

  if (!mongoURI) {
    // Development-only fallback
    console.warn('⚠️  MONGO_URI not set — running in in-memory mock database mode (development only).');
    isMockMode = true;
    return;
  }

  try {
    console.log('Connecting to MongoDB...');

    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
      dbName: 'janvaani'
    });

    console.log('✅ MongoDB connected successfully.');
    console.log(`📂 Database: ${mongoose.connection.name}`);
    isMockMode = false;

  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);

    if (nodeEnv === 'production') {
      // In production, failing silently is worse than crashing cleanly
      throw err;
    }

    // Development fallback
    console.warn('⚠️  Falling back to in-memory mock database (development only).');
    isMockMode = true;
  }
};

const getDbMode = () => ({
  isMockMode,
  mockDb
});

module.exports = { connectDB, getDbMode };
