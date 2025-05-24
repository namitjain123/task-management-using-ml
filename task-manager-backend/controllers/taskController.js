// controllers/taskController.js
const Task = require('../models/Task');
const mlService = require('../services/mlService');
// const { predictTaskPriority } = require('../services/mlService');

// Get all tasks for a user
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.userId });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching tasks');
  }
};
// controllers/taskController.js
exports.createTask = async (req, res) => {
  const { title, description, dueDate, priority, tags, estimatedTime, assignedTo } = req.body;

  if (!title || !description) {
    return res.status(400).send('Title and description are required');
  }

  let timeInMinutes = 0;

  // Add log to verify estimatedTime value
  console.log('Estimated Time:', estimatedTime);

  if (estimatedTime) {
    if (typeof estimatedTime === 'string') {
      const timeParts = estimatedTime.split(' ');
      if (timeParts.length === 2) {
        if (timeParts[1] === 'hours') {
          timeInMinutes = parseInt(timeParts[0]) * 60;
        } else if (timeParts[1] === 'minutes') {
          timeInMinutes = parseInt(timeParts[0]);
        }
      }
    }
  }

  try {
    // Add log to verify model is being called
    console.log('Calling the model for prediction...');
    // const predictedPriority = await predictTaskPriority(description, tags);
    const priority = 'Medium';
    
    // Add log to check predictedPriority
    

    const newTask = new Task({
      title,
      description,
      dueDate: dueDate || null,
      // priority: predictedPriority || 'Medium',
      priority,
      tags: tags || [],
      estimatedTime: timeInMinutes,
      assignedTo: assignedTo || 'Unassigned',
      userId: req.user.userId,
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).send('Error creating task');
  }
};




// Update a task
exports.editTask = async (req, res) => {
    const taskId = req.params.id;
    const { title, description, tags, estimatedTime, assignedTo } = req.body;
  
    try {
      // Predict the task priority using the ML model
      // const predictedPriority = await predictTaskPriority(description, tags);

      const updatedTask = await Task.findByIdAndUpdate(taskId, { title, description, tags, estimatedTime, assignedTo, priority: 'Medium' }, { new: true });
      if (!updatedTask) return res.status(404).send('Task not found');
      res.status(200).send(updatedTask);
    } catch (err) {
      res.status(500).send('Server error');
    }
  };
  

// Delete a task
exports.deleteTask = async (req, res) => {
  const taskId = req.params.id;

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).send('Task not found');

    // Delete the task
    await Task.findByIdAndDelete(taskId);
    res.status(200).send('Task deleted');
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).send('Error deleting task');
  }
};
