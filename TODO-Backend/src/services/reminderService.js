const cron = require('node-cron');
const Task = require('../models/Task');
const User = require('../models/User');
const emailService = require('./emailService');

class ReminderService {
  constructor() {
    this.scheduledReminders = new Map();
    this.startReminderChecker();
  }

  // Check for reminders every minute
  startReminderChecker() {
    cron.schedule('* * * * *', async () => {
      await this.checkAndSendReminders();
    });
    console.log('Reminder service started - checking every minute');
  }

  async checkAndSendReminders() {
    try {
      const now = new Date();
      
      // Find tasks with reminders that should be sent
      const tasksWithReminders = await Task.find({
        'reminder.enabled': true,
        'reminder.sent': false,
        'reminder.datetime': { $lte: now },
        status: { $ne: 'completed' }
      }).populate('user', 'name email');

      for (const task of tasksWithReminders) {
        await this.sendReminder(task);
      }
    } catch (error) {
      console.error('Error checking reminders:', error);
    }
  }

  async sendReminder(task) {
    try {
      const user = task.user;
      
      // Send email reminder
      const result = await emailService.sendTaskReminder(
        user.email,
        user.name,
        task
      );

      if (result.success) {
        // Mark reminder as sent
        await Task.findByIdAndUpdate(task._id, {
          'reminder.sent': true
        });
        
        console.log(`Reminder sent for task: ${task.title} to ${user.email}`);
      } else {
        console.error(`Failed to send reminder for task: ${task.title}`, result.error);
      }
    } catch (error) {
      console.error('Error sending reminder:', error);
    }
  }

  // Schedule a specific reminder (for immediate scheduling)
  async scheduleReminder(taskId, reminderDateTime) {
    try {
      const task = await Task.findById(taskId).populate('user', 'name email');
      if (!task) {
        throw new Error('Task not found');
      }

      const now = new Date();
      const reminderTime = new Date(reminderDateTime);

      if (reminderTime <= now) {
        // Send immediately if time has passed
        await this.sendReminder(task);
      } else {
        // Will be picked up by the cron job
        console.log(`Reminder scheduled for task: ${task.title} at ${reminderTime}`);
      }
    } catch (error) {
      console.error('Error scheduling reminder:', error);
      throw error;
    }
  }

  // Cancel a reminder
  async cancelReminder(taskId) {
    try {
      await Task.findByIdAndUpdate(taskId, {
        'reminder.enabled': false,
        'reminder.sent': false
      });
      console.log(`Reminder cancelled for task: ${taskId}`);
    } catch (error) {
      console.error('Error cancelling reminder:', error);
      throw error;
    }
  }
}

module.exports = new ReminderService();
