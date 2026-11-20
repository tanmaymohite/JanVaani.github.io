const express = require('express');
const cors = require('cors');
const path = require('path');

// Load .env ONLY for local development.
// { override: false } ensures that environment variables already set
// by the host (Render, etc.) are NEVER overridden by the .env file.
// This is the fix that prevents localhost MONGO_URI from overriding
// the Atlas URI set in Render's Environment Variables dashboard.
require('dotenv').config({ override: false });

const { connectDB } = require('./config/db');
const complaintRoutes = require('./routes/complaintRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────────────────────

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ────────────────────────────────────────────────────────────────────

app.use('/api/complaints', complaintRoutes);

// Health-check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to JanVaani (Mahanagarpalika Grievance Portal) API',
    status: 'Running',
    environment: process.env.NODE_ENV || 'development',
    database: process.env.MONGO_URI
      ? (process.env.MONGO_URI.includes('localhost') ? 'localhost (dev)' : 'MongoDB Atlas')
      : 'mock (no URI set)'
  });
});

// ── Startup ───────────────────────────────────────────────────────────────────

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, '0.0.0.0', () => {
      console.log('===================================================');
      console.log(`🚀 JanVaani Server listening on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('===================================================');
    });

  } catch (error) {
    console.error('❌ Failed to start JanVaani server:', error.message);
    process.exit(1);
  }
};

startServer();
