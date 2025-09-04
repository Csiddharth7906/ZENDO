const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const userStatsRoutes = require('./routes/userStats');
const reminderService = require('./services/reminderService');
const taskScheduler = require('./services/taskScheduler');
const path = require('path');
const connectDB = require('./config/db');
const emailService = require('./services/emailService');
require('dotenv').config();

// Custom sanitization function
const sanitize = (obj) => {
  if (!obj) return obj;
  
  Object.keys(obj).forEach(key => {
    // Remove any keys that start with $ (MongoDB operators)
    if (key.startsWith('$')) {
      delete obj[key];
    }
    // Recursively sanitize nested objects
    else if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitize(obj[key]);
    }
  });
  
  return obj;
};

// Load env vars
require('dotenv').config();

// Connect to database
connectDB();

const app = express();

// Enable CORS with credentials
app.use(cors({
  origin: ['http://localhost:5173', 'https://zendo-two.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie']
}));

// Handle preflight requests
app.options('*', cors());

// Set security headers
app.use(helmet());


// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Session configuration (required for Passport)
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Set to true in production with HTTPS
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Allow cross-site cookies in production
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Load Passport config
require('./config/passport');

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Cookie parser - MUST come before routes
app.use(cookieParser());

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));

// Sanitize request data
app.use((req, res, next) => {
  // Sanitize request body
  if (req.body) {
    req.body = sanitize(JSON.parse(JSON.stringify(req.body)));
  }
  
  // Sanitize query parameters
  if (req.query) {
    req.query = sanitize(JSON.parse(JSON.stringify(req.query)));
  }
  
  // Sanitize URL parameters
  if (req.params) {
    req.params = sanitize(JSON.parse(JSON.stringify(req.params)));
  }
  
  next();
});

// Duplicate cookieParser removed

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Simple test route
app.get('/', (req, res) => {
  res.send('API is running'); 
});

// Log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/user', require('./routes/userStats'));
app.use('/api/overdue', require('./routes/overdue'));

// Error handling middleware (must be after all other middleware and routes)
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token failed',
      error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      error: process.env.NODE_ENV === 'development' ? messages : {}
    });
  }

  // Handle duplicate key errors
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate field value entered',
      error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
  }

  // Default to 500 server error
  res.status(err.statusCode || 500).json({ 
    success: false,
    message: err.message || 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : {}
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Resource not found'
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, async () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  
  // Initialize email service only if credentials are provided
  if (process.env.EMAIL_USERNAME && process.env.EMAIL_PASSWORD && 
      process.env.EMAIL_USERNAME !== 'your_mailtrap_username' &&
      process.env.EMAIL_USERNAME !== 'your-gmail@gmail.com') {
    try {
      const emailReady = await emailService.testConnection();
      if (emailReady) {
        console.log('✅ Email service initialized successfully');
        taskScheduler.start();
      } else {
        console.log('⚠️ Email service connection failed - notifications disabled');
      }
    } catch (error) {
      console.log('⚠️ Email service initialization failed - notifications disabled');
    }
  } else {
    console.log('⚠️ Email credentials not configured - notifications disabled');
  }
});
