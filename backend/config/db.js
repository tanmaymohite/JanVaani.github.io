
const mongoose = require('mongoose');

// Mock in-memory database (development only)
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
    // Read environment variables
    const mongoURI = process.env.MONGO_URI;
    const nodeEnv = process.env.NODE_ENV || 'development';

    // Check MongoDB URI
    if (!mongoURI) {
        const error = 'MONGO_URI environment variable is missing!';

        console.error(`❌ ${error}`);

        if (nodeEnv === 'production') {
            throw new Error(error);
        }

        console.warn('⚠️ Running in development mock database mode.');
        isMockMode = true;
        return;
    }

    try {
        console.log('Attempting to connect to MongoDB Atlas...');

        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 10000
        });

        console.log('✅ MongoDB Connected successfully.');
        console.log(`📂 Database: ${mongoose.connection.name}`);

        isMockMode = false;

    } catch (err) {
        console.error('❌ MongoDB Connection Failed:', err.message);

        if (nodeEnv === 'production') {
            console.error('❌ Production database connection failed.');
            throw err;
        }

        console.warn('⚠️ Falling back to in-memory mock database.');
        isMockMode = true;
    }
};

// Get current database mode
const getDbMode = () => {
    return {
        isMockMode,
        mockDb
    };
};

module.exports = {
    connectDB,
    getDbMode
};
