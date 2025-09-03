const express = require('express');
const { check } = require('express-validator');
const passport = require('passport');
const { register, login, logout, getMe, updateDetails, updatePassword } = require('../controllers/authController');
const { googleCallback, googleFailure } = require('../controllers/googleAuthController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post(
  '/register',
  [
    check('name', 'Please add a name').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  register
);

router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  login
);

router.post('/logout', logout);

// Google OAuth routes
router.get('/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/api/auth/google/failure' }),
  googleCallback
);

router.get('/google/failure', googleFailure);

// Protected routes
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
// Removed forgotpassword and resetpassword routes - not needed for core functionality

module.exports = router;
