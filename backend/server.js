const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { connectDB } = require('./config/db');
const complaintRoutes = require('./routes/complaintRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend local development
app.use(cors({
  origin: '*', // In development, allow requests from any host
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to Database
connectDB();

// API Routes
app.use('/api/complaints', complaintRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to JanVaani (Mahanagarpalika Grievance Portal) API',
    status: 'Running'
  });
});

// Start listening
app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🚀 JanVaani Server listening on port ${PORT}`);
  console.log(`📄 Server health check: http://localhost:${PORT}/`);
  console.log(`===================================================`);
});
