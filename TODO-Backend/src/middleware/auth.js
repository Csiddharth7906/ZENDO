const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
const protect = async (req, res, next) => {
  let token;

  // Log incoming request headers for debugging
  console.log('Auth Headers:', req.headers);
  console.log('Cookies:', req.cookies);

  // Get token from header or cookies
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
    console.log('Token from Authorization header');
  } else if (req.cookies?.token) {
    token = req.cookies.token;
    console.log('Token from cookie');
  } else if (req.headers.cookie) {
    // Try to parse cookie manually if cookie-parser didn't work
    const cookies = req.headers.cookie.split(';').reduce((cookies, cookie) => {
      const [name, value] = cookie.trim().split('=');
      cookies[name] = value;
      return cookies;
    }, {});
    
    if (cookies.token) {
      token = cookies.token;
      console.log('Token from manual cookie parsing');
    }
  }

  // Make sure token exists
  if (!token) {
    console.error('No token found in request');
    return res.status(401).json({
      success: false,
      message: 'Not authorized - No token provided'
    });
  }

  try {
    console.log('Verifying token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded:', { id: decoded.id, iat: decoded.iat, exp: decoded.exp });

    // Get user from token
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      console.error('No user found for token');
      return res.status(401).json({
        success: false,
        message: 'Not authorized - User not found'
      });
    }

    console.log('User authenticated:', { id: req.user._id, email: req.user.email });
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    
    let message = 'Not authorized - Invalid token';
    if (error.name === 'TokenExpiredError') {
      message = 'Session expired - Please log in again';
    } else if (error.name === 'JsonWebTokenError') {
      message = 'Invalid token - Please log in again';
    }
    
    return res.status(401).json({
      success: false,
      message,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
