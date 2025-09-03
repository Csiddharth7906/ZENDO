const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Send token response with cookie
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);
  const isProduction = process.env.NODE_ENV === 'production';

  // Cookie options
  const cookieOptions = {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    httpOnly: true,
    secure: isProduction, // Set to true in production (HTTPS)
    sameSite: isProduction ? 'none' : 'lax', // 'none' for cross-site cookies in production
    path: '/'
  };

  // Set the cookie
  res.cookie('token', token, cookieOptions);

  // Redirect to frontend dashboard after successful authentication
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  res.redirect(`${frontendUrl}/dashboard?auth=success`);
};

// @desc    Google OAuth success callback
// @route   GET /api/auth/google/callback
// @access  Public
exports.googleCallback = (req, res) => {
  if (req.user) {
    sendTokenResponse(req.user, 200, res);
  } else {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/login?error=auth_failed`);
  }
};

// @desc    Google OAuth failure callback
// @route   GET /api/auth/google/failure
// @access  Public
exports.googleFailure = (req, res) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  res.redirect(`${frontendUrl}/login?error=auth_failed`);
};
