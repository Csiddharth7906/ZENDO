const Task = require('../models/Task');
const UserStats = require('../models/UserStats');
const { addXPInternal } = require('./userStatsController');
const reminderService = require('../services/reminderService');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res, next) => {
  try {
    // Filtering
    const query = { user: req.user.id };
    
    // Sorting
    const sort = {};
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(':');
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1; // Default sort by newest first
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Get tasks
    const tasks = await Task.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Task.countDocuments(query);

    res.status(200).json({
      success: true,
      count: tasks.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: tasks
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res, next) => {
  try {
    console.log('Creating task with data:', req.body);
    
    // Add user to req.body
    req.body.user = req.user.id;

    // Validate required fields
    if (!req.body.title) {
      return res.status(400).json({ 
        success: false,
        message: 'Title is required' 
      });
    }

    // Set default values if not provided
    if (!req.body.status) {
      req.body.status = 'todo';
    }
    // Convert frontend status values to backend values
    if (req.body.status === 'pending') {
      req.body.status = 'todo';
    }
    if (!req.body.priority) {
      req.body.priority = 'medium';
    }

    const task = await Task.create(req.body);
    console.log('Task created successfully:', task);

    // Schedule reminder if enabled
    if (req.body.reminder && req.body.reminder.enabled && req.body.reminder.datetime) {
      try {
        await reminderService.scheduleReminder(task._id, req.body.reminder.datetime);
        console.log('Reminder scheduled for task:', task._id);
      } catch (reminderError) {
        console.error('Error scheduling reminder:', reminderError);
        // Continue with task creation even if reminder scheduling fails
      }
    }

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Error creating task:', {
      message: error.message,
      name: error.name,
      code: error.code,
      errors: error.errors,
      stack: error.stack
    });
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res, next) => {
  try {
    console.log('Updating task:', { taskId: req.params.id, updates: req.body });
    
    // Find the task
    let task = await Task.findById(req.params.id);

    if (!task) {
      console.log('Task not found');
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Make sure user owns the task
    if (task.user.toString() !== req.user.id) {
      console.log('Unauthorized: User does not own this task');
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this task'
      });
    }

    const wasCompleted = task.status === 'completed';
    const isCompleting = req.body.status === 'completed' && !wasCompleted;
    const isReverting = !req.body.status || req.body.status !== 'completed' && wasCompleted;

    console.log('Task status change:', { wasCompleted, isCompleting, isReverting });

    // If task is being marked as completed
    if (isCompleting) {
      console.log('Marking task as completed');
      req.body.completedAt = new Date();
      
      // Award XP if not already awarded
      if (!task.xpAwarded) {
        const xpToAdd = task.xpValue || parseInt(process.env.BASE_XP) || 10;
        console.log('Awarding XP:', xpToAdd);
        
        try {
          // Add XP to user's stats
          await addXPInternal(req.user.id, xpToAdd);
          
          // Mark XP as awarded
          req.body.xpAwarded = true;
          console.log('XP awarded successfully');
        } catch (xpError) {
          console.error('Error awarding XP:', xpError);
          // Continue with task update even if XP award fails
        }
      } else {
        console.log('XP already awarded for this task');
      }
    }
    // If task is being unmarked as completed
    else if (isReverting) {
      console.log('Reverting task completion');
      req.body.completedAt = null;
      // Note: We're not removing XP on revert to prevent exploitation
    }

    // Update the task
    const updateData = { ...req.body };
    
    // Don't allow user to modify these fields directly
    delete updateData.user;
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    console.log('Updating task with data:', updateData);
    
    task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { 
        new: true,
        runValidators: true,
        context: 'query'
      }
    );

    // Handle reminder updates
    if (updateData.reminder) {
      try {
        if (updateData.reminder.enabled && updateData.reminder.datetime) {
          await reminderService.scheduleReminder(task._id, updateData.reminder.datetime);
          console.log('Reminder updated for task:', task._id);
        } else if (!updateData.reminder.enabled) {
          await reminderService.cancelReminder(task._id);
          console.log('Reminder cancelled for task:', task._id);
        }
      } catch (reminderError) {
        console.error('Error updating reminder:', reminderError);
      }
    }

    // Get updated user stats
    const userStats = await UserStats.findOne({ user: req.user.id }).lean();
    console.log('Updated user stats:', userStats);

    res.status(200).json({
      success: true,
      data: {
        ...task.toObject(),
        userStats: userStats || null
      }
    });
  } catch (error) {
    console.error('Error updating task:', {
      message: error.message,
      name: error.name,
      code: error.code,
      errors: error.errors,
      stack: error.stack
    });
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Make sure user owns the task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this task'
      });
    }

    await Task.deleteOne({ _id: task._id });

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
