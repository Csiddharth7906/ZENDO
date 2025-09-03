require('dotenv').config();
const mongoose = require('mongoose');
const emailService = require('./src/services/emailService');
const overdueTaskService = require('./src/services/overdueTaskService');
const Task = require('./src/models/Task');
const User = require('./src/models/User');

async function testCompleteEmailSystem() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to database');

    console.log('\n=== TESTING EMAIL SYSTEM ===\n');

    // Test 1: Welcome Email
    console.log('1. Testing Welcome Email...');
    const welcomeResult = await emailService.sendWelcomeEmail('test@example.com', 'Test User');
    console.log('Welcome email result:', welcomeResult.success ? '✅ SUCCESS' : '❌ FAILED');

    // Test 2: Create a test overdue task
    console.log('\n2. Creating test overdue task...');
    
    // Find or create a test user
    let testUser = await User.findOne({ email: 'test@example.com' });
    if (!testUser) {
      testUser = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'testpassword123'
      });
      console.log('Created test user');
    }

    // Create an overdue task (due yesterday)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const overdueTask = await Task.create({
      title: 'Test Overdue Task',
      description: 'This is a test task that is overdue',
      dueDate: yesterday,
      priority: 'high',
      status: 'todo',
      user: testUser._id,
      overdueNotificationSent: false
    });

    console.log('Created overdue task:', overdueTask.title);

    // Test 3: Overdue Task Detection
    console.log('\n3. Testing Overdue Task Detection...');
    const overdueResult = await overdueTaskService.checkAndNotify();
    console.log('Overdue check result:', `${overdueResult.sent} sent, ${overdueResult.failed} failed`);

    // Test 4: Check if task was marked as notified
    const updatedTask = await Task.findById(overdueTask._id);
    console.log('Task notification status:', updatedTask.overdueNotificationSent ? '✅ MARKED' : '❌ NOT MARKED');

    console.log('\n=== EMAIL TESTING COMPLETE ===');
    console.log('📧 Check your Mailtrap inbox at: https://mailtrap.io/inboxes');
    console.log('\nTo test in your app:');
    console.log('1. Register a new user → Should receive welcome email');
    console.log('2. Create tasks with past due dates → Should receive overdue notifications');
    console.log('3. Use API endpoint: POST /api/overdue/check (manual trigger)');
    console.log('4. Use API endpoint: GET /api/overdue/my-tasks (see your overdue tasks)');

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from database');
  }
}

testCompleteEmailSystem();
