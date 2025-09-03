const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const taskScheduler = require('../services/taskScheduler');
const emailService = require('../services/emailService');

// @desc    Manually trigger overdue task check
// @route   POST /api/notifications/check-overdue
// @access  Private (Admin only for testing)
router.post('/check-overdue', protect, async (req, res) => {
  try {
    console.log(`Manual overdue check triggered by user: ${req.user.email}`);
    await taskScheduler.triggerCheck();
    
    res.status(200).json({
      success: true,
      message: 'Overdue task check completed successfully'
    });
  } catch (error) {
    console.error('Error in manual overdue check:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check overdue tasks',
      error: error.message
    });
  }
});

// @desc    Test email service connection
// @route   GET /api/notifications/test-email
// @access  Private
router.get('/test-email', protect, async (req, res) => {
  try {
    const isConnected = await emailService.testConnection();
    
    res.status(200).json({
      success: true,
      message: isConnected ? 'Email service is working' : 'Email service connection failed',
      connected: isConnected
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error testing email service',
      error: error.message
    });
  }
});

// @desc    Send test notification to current user
// @route   POST /api/notifications/test-send
// @access  Private
router.post('/test-send', protect, async (req, res) => {
  try {
    if (!req.user.email) {
      return res.status(400).json({
        success: false,
        message: 'User email not found'
      });
    }

    // Create a mock overdue task for testing
    const mockTask = {
      title: 'Test Overdue Task',
      dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      description: 'This is a test notification'
    };

    const result = await emailService.sendOverdueTaskNotification(
      req.user.email,
      req.user.name,
      [mockTask]
    );

    if (result.success) {
      res.status(200).json({
        success: true,
        message: `Test notification sent to ${req.user.email}`,
        messageId: result.messageId
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send test notification',
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error sending test notification',
      error: error.message
    });
  }
});

module.exports = router;
