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

// Enhanced CORS configuration for browser extension
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or curl)
    if (!origin) {
      return callback(null, true);
    }
    
    // Allow Chrome extensions (chrome-extension://*)
    if (origin.startsWith('chrome-extension://')) {
      return callback(null, true);
    }
    
    // Allow Firefox extensions (moz-extension://*)
    if (origin.startsWith('moz-extension://')) {
      return callback(null, true);
    }
    
    // Allow Safari extensions (safari-extension://*)
    if (origin.startsWith('safari-extension://')) {
      return callback(null, true);
    }
    
    // Allow localhost on any port
    if (origin.match(/^https?:\/\/localhost(:\d+)?$/)) {
      return callback(null, true);
    }
    
    // Allow 127.0.0.1 on any port (for web frontend)
    if (origin.match(/^https?:\/\/127\.0\.0\.1(:\d+)?$/)) {
      return callback(null, true);
    }
    
    // Allow Vite dev server (typically runs on port 5173)
    if (origin.match(/^https?:\/\/localhost:5173$/)) {
      return callback(null, true);
    }
    
    // Allow any localhost port for React dev servers
    if (origin.match(/^https?:\/\/localhost:\d+$/)) {
      return callback(null, true);
    }
    
    // Allow job board sites (for content scripts)
    const jobBoardDomains = [
      'https://www.linkedin.com',
      'https://linkedin.com',
      'https://in.indeed.com',
      'https://www.indeed.com',
      'https://www.naukri.com',
      'https://www.glassdoor.com',
      'https://www.glassdoor.co.in',
    ];
    
    for (const domain of jobBoardDomains) {
      if (origin.startsWith(domain)) {
        return callback(null, true);
      }
    }
    
    // Allow specific production domains
    const allowedOrigins = [
      'https://platform-frontend-gamma-two.vercel.app',
      'https://app.mentorquedu.com',
      'https://nodejs-service-production-e9b3.up.railway.app',
    ];
    
    // Allow Railway domains (any *.up.railway.app)
    if (origin.includes('.up.railway.app')) {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Log blocked origins for debugging
    console.log(`[CORS] Blocked origin: ${origin}`);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'x-api-key',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  exposedHeaders: ['x-api-key'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Custom request logging middleware for performance tracking
app.use((req, res, next) => {
  const startTime = Date.now();
  const originalSend = res.send;
  
  // Log request details for debugging
  console.log(`[REQUEST_DEBUG] ${req.method} ${req.path}`, {
    contentType: req.get('Content-Type'),
    contentLength: req.get('Content-Length'),
    hasBody: !!req.body,
    bodyType: typeof req.body,
    bodyKeys: req.body ? Object.keys(req.body) : 'no body',
    rawBody: req.body
  });
  
  res.send = function(data) {
    const duration = Date.now() - startTime;
    console.log(`[REQUEST] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`, {
      userAgent: req.get('User-Agent')?.substring(0, 50) + '...',
      contentLength: res.get('Content-Length') || 'unknown',
      timestamp: new Date().toISOString()
    });
    
    // Log slow requests (>1 second)
    if (duration > 1000) {
      console.warn(`[SLOW_REQUEST] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms) - This request took longer than 1 second`);
    }
    
    originalSend.call(this, data);
  };
  
  next();
});

app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.text({ type: 'text/plain', limit: '10mb' }));

// Public health check (no auth)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Additional health check for API endpoints
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    api: 'running',
    timestamp: new Date().toISOString(),
    cors: 'enabled'
  });
});

// Debug: Log all incoming requests to see what paths are being hit
app.use((req, res, next) => {
  console.log(`[ROUTE_DEBUG] ${req.method} ${req.path} - Original URL: ${req.originalUrl} - Base URL: ${req.baseUrl}`);
  next();
});

// Routes - All routes are mounted at /api
app.use('/api', routes);

// Temporary handler for /auth/validate (forwards to /api/auth/validate)
// This is a workaround if frontend is calling wrong URL
// TODO: Remove this once frontend is updated to use /api/auth/validate
const authController = require('./src/controllers/auth');
app.post('/auth/validate', (req, res, next) => {
  console.log('[WARNING] Request to /auth/validate detected - should be /api/auth/validate');
  console.log('[WARNING] Full URL:', req.protocol + '://' + req.get('host') + req.originalUrl);
  console.log('[WARNING] Forwarding to auth controller...');
  // Forward to the actual auth controller
  authController.validateApiKeyPublic(req, res, next);
});

// Catch-all for unmatched routes (for debugging)
app.use((req, res, next) => {
  console.log(`[UNMATCHED_ROUTE] ${req.method} ${req.originalUrl} - Path: ${req.path}`);
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path,
    originalUrl: req.originalUrl,
    method: req.method,
    hint: 'All API routes should be prefixed with /api',
    availableRoutes: [
      '/api/auth/validate',
      '/api/health',
      '/api/keywords',
      '/api/chat',
      '/api/coverletter',
      '/api/experience',
      '/api/hr-lookup',
      '/api/upload-resume',
      '/api/applied-jobs'
    ]
  });
});

// File upload & validation error handling
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'File too large (max 5MB)' });
  }

  if (err.message === 'Only PDFs are allowed') {
    return res.status(400).json({ error: 'Invalid file type' });
  }

  next(err);
});

// Centralized error handling
app.use((err, req, res, next) => {
  const timestamp = new Date().toISOString();
  const requestInfo = {
    method: req.method,
    path: req.path,
    userAgent: req.get('User-Agent'),
    ip: req.ip || req.connection.remoteAddress,
    headers: {
      'x-api-key': req.headers['x-api-key'] ? 'present' : 'missing',
      'content-type': req.headers['content-type'],
      'content-length': req.headers['content-length']
    },
    body: req.body ? {
      hasBody: true,
      bodyType: typeof req.body,
      bodyKeys: Object.keys(req.body || {}),
      bodySize: JSON.stringify(req.body || {}).length
    } : { hasBody: false }
  };

  console.error(`[ERROR] ${timestamp} - ${req.method} ${req.path}:`, {
    message: err.message,
    stack: err.stack,
    code: err.code,
    name: err.name,
    request: requestInfo
  });

  const msg = err.message || 'An unexpected error occurred';

  if (msg.includes('API key')) {
    console.log(`[ERROR] API key error for ${req.method} ${req.path}`);
    return res.status(401).json({ error: 'Invalid API key', message: msg });
  }

  if (msg.includes('quota') || msg.includes('rate limit')) {
    console.log(`[ERROR] Rate limit error for ${req.method} ${req.path}`);
    return res.status(429).json({ error: 'Rate limit exceeded', message: msg });
  }

  if (err.code === 'P2002') {
    console.log(`[ERROR] Database unique constraint violation for ${req.method} ${req.path}`);
    return res.status(409).json({ error: 'Duplicate entry', message: 'A record with this information already exists' });
  }

  if (err.code === 'P2025') {
    console.log(`[ERROR] Database record not found for ${req.method} ${req.path}`);
    return res.status(404).json({ error: 'Record not found', message: 'The requested record could not be found' });
  }

  console.log(`[ERROR] Unhandled error for ${req.method} ${req.path}:`, {
    errorType: 'unhandled',
    message: msg,
    code: err.code
  });

  res.status(500).json({ error: 'Internal server error', message: msg });
});

module.exports = app;