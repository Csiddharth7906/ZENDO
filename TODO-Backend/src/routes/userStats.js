const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getUserStats,
  addXP,
  getLeaderboard
} = require('../controllers/userStatsController');

const router = express.Router();

// All routes are protected and require authentication
router.use(protect);

// Get current user's stats
router.get('/me', getUserStats);

// Add XP to current user
router.post('/xp', addXP);

// Get leaderboard
router.get('/leaderboard', getLeaderboard);

module.exports = router;
