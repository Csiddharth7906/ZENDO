const cron = require('node-cron');
const overdueTaskService = require('./overdueTaskService');

class TaskScheduler {
  constructor() {
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) {
      console.log('Task scheduler is already running');
      return;
    }

    // Run every day at 9:00 AM
    this.dailyCheck = cron.schedule('0 9 * * *', async () => {
      await overdueTaskService.checkAndNotify();
    }, {
      scheduled: false
    });

    // For testing: run every 5 minutes (uncomment for testing)
    this.testCheck = cron.schedule('*/5 * * * *', async () => {
      await overdueTaskService.checkAndNotify();
    }, {
      scheduled: false
    });

    this.dailyCheck.start();
    this.testCheck.start(); // Enable for testing - comment out in production

    this.isRunning = true;
    console.log('Task scheduler started - checking for overdue tasks daily at 9:00 AM (and every 5 minutes for testing)');
  }

  stop() {
    if (this.dailyCheck) {
      this.dailyCheck.stop();
    }
    if (this.testCheck) {
      this.testCheck.stop();
    }
    this.isRunning = false;
    console.log('Task scheduler stopped');
  }

  // Manual trigger for testing
  async triggerCheck() {
    console.log('Manually triggering overdue task check...');
    await overdueTaskService.checkAndNotify();
  }
}

module.exports = new TaskScheduler();
