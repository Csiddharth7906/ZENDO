const UserStats = require('../models/UserStats');
const User = require('../models/User');

// @desc    Get user stats
// @route   GET /api/user/stats
// @access  Private
exports.getUserStats = async (req, res) => {
  try {
    const stats = await UserStats.findOne({ user: req.user.id })
      .select('-__v -createdAt -updatedAt');
    
    if (!stats) {
      return res.status(404).json({ success: false, message: 'User stats not found' });
    }
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting user stats:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Helper function to add XP without sending response (for internal use)
exports.addXPInternal = async (userId, amount) => {
  let stats = await UserStats.findOne({ user: userId });
  
  if (!stats) {
    stats = new UserStats({
      user: userId,
      xp: 0,
      level: 1
    });
  }
  
  const { leveledUp, newLevel } = stats.addXP(amount);
  const { currentStreak, streakUpdated } = stats.updateStreak();
  
  await stats.save();
  
  return {
    xp: stats.xp,
    level: stats.level,
    leveledUp,
    newLevel,
    currentStreak,
    streakUpdated
  };
};

// @desc    Add XP to user
// @route   POST /api/user/xp
// @access  Private
exports.addXP = async (req, res) => {
  try {
    const { amount, taskId } = req.body;
    
    if (!amount || isNaN(amount)) {
      return res.status(400).json({ success: false, message: 'Invalid XP amount' });
    }
    
    const result = await exports.addXPInternal(req.user.id, amount);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error adding XP:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get leaderboard
// @route   GET /api/leaderboard
// @access  Private
exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await UserStats.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          'user.password': 0,
          'user.__v': 0,
          'user.createdAt': 0,
          'user.updatedAt': 0,
          '__v': 0
        }
      },
      { $sort: { level: -1, xp: -1 } },
      { $limit: 100 }
    ]);
    
    res.status(200).json({
      success: true,
      count: leaderboard.length,
      data: leaderboard
    });
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
