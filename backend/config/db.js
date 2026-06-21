const mongoose = require('mongoose');

// Mock in-memory database store in case MongoDB is unavailable
const mockDb = {
  complaints: [],
  stats: {
    total: 0,
    registered: 0,
    underReview: 0,
    resolved: 0
  }
};

let isMockMode = false;

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/janvaani';
  try {
    console.log(`Attempting to connect to MongoDB at: ${mongoURI}...`);
    // Set connection timeout to 4 seconds for fast fallback
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 4000
    });
    console.log('MongoDB Connected successfully.');
    isMockMode = false;
  } catch (err) {
    console.error('MongoDB Connection Failed:', err.message);
    console.log('⚠️ WARNING: Falling back to Local Mock (In-Memory) Database Mode.');
    console.log('Active grievances will be saved in memory and will reset when the server restarts.');
    isMockMode = true;
  }
};

const getDbMode = () => {
  return {
    isMockMode,
    mockDb
  };
};

module.exports = { connectDB, getDbMode };
