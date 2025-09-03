const express = require('express');
const router = express.Router();
const overdueTaskService = require('../services/overdueTaskService');
const { protect } = require('../middleware/auth');

// @desc    Check for overdue tasks and send notifications
// @route   POST /api/overdue/check
// @access  Private (Admin only - you can add admin middleware later)
router.post('/check', protect, async (req, res) => {
  try {
    const result = await overdueTaskService.checkAndNotify();
    
    res.status(200).json({
      success: true,
      message: `Overdue check complete: ${result.sent} notifications sent, ${result.failed} failed`,
      data: result
    });
  } catch (error) {
    console.error('Error in overdue check endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get overdue tasks for current user
// @route   GET /api/overdue/my-tasks
// @access  Private
router.get('/my-tasks', protect, async (req, res) => {
  try {
    const Task = require('../models/Task');
    const now = new Date();
    
    const overdueTasks = await Task.find({
      user: req.user.id,
      dueDate: { $lt: now },
      status: { $ne: 'completed' }
    }).sort({ dueDate: 1 });

    res.status(200).json({
      success: true,
      count: overdueTasks.length,
      data: overdueTasks
    });
  } catch (error) {
    console.error('Error getting overdue tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
