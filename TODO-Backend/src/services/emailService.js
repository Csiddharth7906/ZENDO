const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  async sendWelcomeEmail(userEmail, userName) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: userEmail,
        subject: '🎉 Welcome to TaskMaster - Let\'s Get Organized!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; padding: 20px;">
            <div style="background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h1 style="color: #3b82f6; text-align: center; margin-bottom: 30px;">🎉 Welcome to TaskMaster!</h1>
              
              <p style="font-size: 18px; color: #374151;">Hi ${userName},</p>
              
              <p style="color: #6b7280; line-height: 1.6;">
                Welcome to TaskMaster! We're excited to help you stay organized and productive. 
                Your account has been successfully created and you're ready to start managing your tasks like a pro!
              </p>
              
              <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 25px 0; border-radius: 5px;">
                <h3 style="color: #1e40af; margin-top: 0;">🚀 Get Started:</h3>
                <ul style="color: #374151; margin: 10px 0;">
                  <li>Create your first task</li>
                  <li>Set due dates and priorities</li>
                  <li>Complete tasks to earn XP and level up</li>
                  <li>Build streaks for bonus rewards</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL}" style="background-color: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Start Managing Tasks</a>
              </div>
              
              <p style="color: #9ca3af; font-size: 14px; text-align: center; margin-top: 30px;">
                Happy task managing!<br>
                The TaskMaster Team
              </p>
            </div>
          </div>
        `
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Welcome email sent:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      return { success: false, error: error.message };
    }
  }

  async sendOverdueTaskNotification(userEmail, userName, overdueTasks) {
    try {
      const taskList = overdueTasks.map(task => 
        `• ${task.title} (Due: ${new Date(task.dueDate).toLocaleDateString()})`
      ).join('\n');

      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: userEmail,
        subject: '⏰ You have overdue tasks - Task Manager',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">⏰ Overdue Tasks Reminder</h2>
            <p>Hi ${userName},</p>
            <p>You have <strong>${overdueTasks.length}</strong> overdue task${overdueTasks.length > 1 ? 's' : ''} that need your attention:</p>
            
            <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #dc2626;">Overdue Tasks:</h3>
              ${overdueTasks.map(task => `
                <div style="margin-bottom: 10px; padding: 10px; background-color: white; border-radius: 5px;">
                  <strong>${task.title}</strong><br>
                  <small style="color: #666;">Due: ${new Date(task.dueDate).toLocaleDateString()}</small>
                  ${task.description ? `<br><em>${task.description}</em>` : ''}
                </div>
              `).join('')}
            </div>
            
            <p>Please log in to your task manager to update these tasks.</p>
            <p style="margin-top: 30px; color: #666; font-size: 12px;">
              This is an automated reminder from your Task Manager.
            </p>
          </div>
        `
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Overdue task notification sent:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Failed to send overdue task notification:', error);
      return { success: false, error: error.message };
    }
  }

  async sendTaskReminder(userEmail, userName, task) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: userEmail,
        subject: `🔔 Reminder: ${task.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; padding: 20px;">
            <div style="background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h1 style="color: #f59e0b; text-align: center; margin-bottom: 30px;">🔔 Task Reminder</h1>
              
              <p style="font-size: 18px; color: #374151;">Hi ${userName},</p>
              
              <p style="color: #6b7280; line-height: 1.6;">
                This is a reminder for your task:
              </p>
              
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 25px 0; border-radius: 5px;">
                <h3 style="color: #92400e; margin-top: 0; font-size: 20px;">${task.title}</h3>
                ${task.description ? `<p style="color: #374151; margin: 10px 0;">${task.description}</p>` : ''}
                <div style="margin-top: 15px;">
                  <span style="background-color: ${task.priority === 'high' ? '#fee2e2' : task.priority === 'medium' ? '#fef3c7' : '#dbeafe'}; 
                               color: ${task.priority === 'high' ? '#dc2626' : task.priority === 'medium' ? '#d97706' : '#2563eb'}; 
                               padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">
                    ${task.priority.toUpperCase()} PRIORITY
                  </span>
                  ${task.dueDate ? `<span style="margin-left: 10px; color: #6b7280; font-size: 14px;">Due: ${new Date(task.dueDate).toLocaleDateString()}</span>` : ''}
                </div>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL}" style="background-color: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Task</a>
              </div>
              
              <p style="color: #9ca3af; font-size: 14px; text-align: center; margin-top: 30px;">
                Stay organized with Zendo!<br>
                The Zendo Team
              </p>
            </div>
          </div>
        `
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Task reminder sent:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Failed to send task reminder:', error);
      return { success: false, error: error.message };
    }
  }

  async testConnection() {
    try {
      // Skip email verification if credentials are not configured
      if (!process.env.EMAIL_USERNAME || !process.env.EMAIL_PASSWORD) {
        console.log('⚠️ Email credentials not configured - email notifications disabled');
        return false;
      }
      
      console.log('Testing email connection with:', {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        username: process.env.EMAIL_USERNAME
      });
      
      await this.transporter.verify();
      console.log('✅ Email service is ready');
      return true;
    } catch (error) {
      console.error('⚠️ Email service connection failed:', error.message);
      return false;
    }
  }
}

module.exports = new EmailService();
