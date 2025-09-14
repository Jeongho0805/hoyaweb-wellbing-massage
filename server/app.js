const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

const uploadRoutes = require('./routes/upload');
const contentRoutes = require('./routes/content');
const authRoutes = require('./routes/auth');

const app = express();

// Middleware setup
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));

// CORS setup
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'https://wellbing-massage.hoyaweb.practicket.com'],
  credentials: true
}));

// API rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/upload', uploadRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(error.status || 500).json({
    message: error.message || 'Internal Server Error',
  });
});

module.exports = app;
