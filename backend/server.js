
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { connectDB } = require('./config/db');
const complaintRoutes = require('./routes/complaintRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/complaints', complaintRoutes);

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to JanVaani (Mahanagarpalika Grievance Portal) API',
        status: 'Running'
    });
});

// Start server only after successful database connection
const startServer = async () => {
    try {
        console.log('Connecting to MongoDB Atlas...');

        await connectDB();

        app.listen(PORT, '0.0.0.0', () => {
            console.log('===================================================');
            console.log(`🚀 JanVaani Server listening on port ${PORT}`);
            console.log(`📄 Server health check: http://localhost:${PORT}/`);
            console.log('✅ Database connection established');
            console.log('===================================================');
        });

    } catch (error) {
        console.error('❌ Failed to start JanVaani server.');
        console.error('Database Error:', error.message);

        process.exit(1);
    }
};

// Run application
startServer();
