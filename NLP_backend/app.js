const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./src/routes');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.text({ type: 'text/plain', limit: '10mb' }));

// Routes
app.use('/', routes);

// File upload and validation error handling
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'File too large (max 5MB)' });
  }

  if (err.message === 'Only PDFs are allowed') {
    return res.status(400).json({ error: 'Invalid file type' });
  }
  // For other errors, defer to the centralized error handler below
  return next(err);
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error("An error occurred:", err);

  // Handle specific Google AI API errors
  if (err.message?.includes('API key') || err.message?.includes('authentication')) {
    return res.status(401).json({
      error: 'Authentication failed',
      message: 'Invalid API key'
    });
  }

  if (err.message?.includes('quota') || err.message?.includes('rate limit')) {
    return res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'Too many requests, please try again later'
    });
  }

  if (err.message?.includes('timeout') || err.code === 'ECONNABORTED') {
    return res.status(408).json({
      error: 'Request timeout',
      message: 'Request took too long to process'
    });
  }

  if (err.message?.includes('content policy') || err.message?.includes('safety')) {
    return res.status(400).json({
      error: 'Content policy violation',
      message: 'The content violates content policy'
    });
  }

  if (err.message?.includes('model not found') || err.message?.includes('invalid model')) {
    return res.status(400).json({
      error: 'Invalid model',
      message: 'The specified model is not available'
    });
  }

  // Handle JSON parsing errors
  if (err.message?.includes('Found a JSON block, but it contained invalid JSON')) {
    return res.status(500).json({
      error: 'Response parsing error',
      message: 'Invalid JSON received from AI service'
    });
  }

  if (err.message?.includes('Could not find a valid JSON object')) {
    return res.status(500).json({
      error: 'Response parsing error',
      message: 'No valid JSON found in AI service response'
    });
  }

  // Default error response
  res.status(500).json({
    error: 'Internal server error',
    message: err.message || 'An unexpected error occurred'
  });
});

module.exports = app;
