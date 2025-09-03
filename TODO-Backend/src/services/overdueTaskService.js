const Task = require('../models/Task');
const User = require('../models/User');
const emailService = require('./emailService');

class OverdueTaskService {
  async findOverdueTasks() {
    try {
      const now = new Date();
      
      // Find all tasks that are overdue (due date has passed and status is not completed)
      const overdueTasks = await Task.find({
        dueDate: { $lt: now },
        status: { $ne: 'completed' },
        overdueNotificationSent: { $ne: true } // Only tasks that haven't been notified yet
      }).populate('user', 'name email');

      console.log(`Found ${overdueTasks.length} overdue tasks`);
      return overdueTasks;
    } catch (error) {
      console.error('Error finding overdue tasks:', error);
      return [];
    }
  }

  async sendOverdueNotifications() {
    try {
      const overdueTasks = await this.findOverdueTasks();
      
      if (overdueTasks.length === 0) {
        console.log('No overdue tasks found');
        return { sent: 0, failed: 0 };
      }

      // Group tasks by user
      const tasksByUser = {};
      overdueTasks.forEach(task => {
        const userId = task.user._id.toString();
        if (!tasksByUser[userId]) {
          tasksByUser[userId] = {
            user: task.user,
            tasks: []
          };
        }
        tasksByUser[userId].tasks.push(task);
      });

      let sent = 0;
      let failed = 0;

      // Send notifications to each user
      for (const userId in tasksByUser) {
        const { user, tasks } = tasksByUser[userId];
        
        try {
          console.log(`Sending overdue notification to ${user.email} for ${tasks.length} tasks`);
          
          const result = await emailService.sendOverdueTaskNotification(
            user.email,
            user.name,
            tasks
          );

          if (result.success) {
            // Mark tasks as notified
            const taskIds = tasks.map(task => task._id);
            await Task.updateMany(
              { _id: { $in: taskIds } },
              { overdueNotificationSent: true }
            );
            sent++;
            console.log(`✅ Notification sent to ${user.email}`);
          } else {
            failed++;
            console.log(`❌ Failed to send notification to ${user.email}:`, result.error);
          }
        } catch (error) {
          failed++;
          console.error(`❌ Error sending notification to ${user.email}:`, error);
        }
      }

      console.log(`Overdue notifications summary: ${sent} sent, ${failed} failed`);
      return { sent, failed };
    } catch (error) {
      console.error('Error in sendOverdueNotifications:', error);
      return { sent: 0, failed: 0 };
    }
  }

  async checkAndNotify() {
    console.log('🔍 Checking for overdue tasks...');
    const result = await this.sendOverdueNotifications();
    console.log(`📧 Overdue task check complete: ${result.sent} notifications sent, ${result.failed} failed`);
    return result;
  }
}

module.exports = new OverdueTaskService();
