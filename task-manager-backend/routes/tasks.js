// routes/tasks.js
const express = require('express');
const router = express.Router();
const { getTasks, createTask, editTask, deleteTask } = require('../controllers/taskController');
const authenticate = require('../middleware/authenticate');

// Middleware to authenticate user
router.use(authenticate);

// Get tasks
router.get('/', getTasks);

// Create task
router.post('/', createTask);

// Update task
router.put('/:id', editTask);

// Delete task
router.delete('/:id', deleteTask);

module.exports = router;
