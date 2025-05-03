// controllers/taskController.js
const Task = require('../models/Task');
const mlService = require('../services/mlService');

// Get all tasks for a user
exports.getTasks = async (req, res) => {
  const tasks = await Task.find({ userId: req.user.userId });
  res.json(tasks);
};

// controllers/taskController.js
exports.createTask = async (req, res) => {
  const { title, description, dueDate, priority, tags, estimatedTime, assignedTo } = req.body;

  // Ensure required fields are present
  if (!title || !description) {
    return res.status(400).send('Title and description are required');
  }

  // Convert estimated time from string to number (in minutes)
  let timeInMinutes = 0;
  if (estimatedTime) {
    const timeParts = estimatedTime.split(' ');  // Split by space (e.g., "2 hours")
    if (timeParts[1] === 'hours') {
      timeInMinutes = parseInt(timeParts[0]) * 60;  // Convert hours to minutes
    } else if (timeParts[1] === 'minutes') {
      timeInMinutes = parseInt(timeParts[0]);
    }
  }

  const newTask = new Task({
    title,
    description,
    dueDate: dueDate || null,
    priority: priority || 'Medium',
    tags: tags || [],
    estimatedTime: timeInMinutes,
    assignedTo: assignedTo || 'Unassigned',
    userId: req.user.userId,  // Assuming you're associating tasks with users
  });

  try {
    await newTask.save();
    res.status(201).send('Task created successfully');
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).send('Error creating task');
  }
};


// Update a task
// controllers/taskController.js
exports.editTask = async (req, res) => {
    const taskId = req.params.id;
    const { title, description } = req.body;
  
    try {
      const updatedTask = await Task.findByIdAndUpdate(taskId, { title, description }, { new: true });
      if (!updatedTask) return res.status(404).send('Task not found');
      res.status(200).send(updatedTask);
    } catch (err) {
      res.status(500).send('Server error');
    }
  };
  

// Delete a task
exports.deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).send('Task not found');
  await Task.findByIdAndDelete(req.params.id);
  res.send('Task deleted');
};
