const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const resourceRoutes = require('./routes/resources');
const academicRoutes = require('./routes/academic');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sawhuman2008_db_user:XEGKvT0HN6Nx5ieh@campusnotes.4wtv3rr.mongodb.net/?appName=campusnotes';

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'CampusNotes API (TCET)',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/resources', resourceRoutes);
app.use('/api/v1/academic', academicRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Error]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start Server
if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log('✅ Connected to MongoDB');
      app.listen(PORT, () => {
        console.log(`🚀 CampusNotes API running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.warn('⚠️ MongoDB connection warning:', err.message);
      app.listen(PORT, () => {
        console.log(`🚀 CampusNotes API running in fallback mode on port ${PORT}`);
      });
    });
}

module.exports = app;
