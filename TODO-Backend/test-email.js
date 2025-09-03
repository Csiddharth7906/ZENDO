require('dotenv').config();
const emailService = require('./src/services/emailService');
const sendEmail = require('./src/utils/sendEmail');

async function testEmail() {
  console.log('Testing email connection...');
  console.log('Email config:', {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    username: process.env.EMAIL_USERNAME ? 'Set' : 'Not set',
    password: process.env.EMAIL_PASSWORD ? 'Set' : 'Not set'
  });
  
  // Test 1: Check connection
  const connectionTest = await emailService.testConnection();
  console.log('Connection test:', connectionTest ? 'PASSED' : 'FAILED');
  
  if (connectionTest) {
    // Test 2: Send a test email
    try {
      console.log('\nSending test email...');
      await sendEmail({
        email: 'test@example.com', // This will appear in your Mailtrap inbox
        subject: 'Test Email from TaskMaster',
        message: 'This is a test email to verify the email functionality is working!'
      });
      console.log('✅ Test email sent successfully!');
      console.log('📧 Check your Mailtrap inbox at: https://mailtrap.io/inboxes');
    } catch (error) {
      console.error('❌ Failed to send test email:', error.message);
    }
  }
}

testEmail();
