const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');

const router = express.Router();

// All routes are protected and require authentication
router.use(protect);

// Routes for /api/tasks
router
  .route('/')
  .get(getTasks)
  .post(createTask);

// Routes for /api/tasks/:id
router
  .route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;
