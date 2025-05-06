const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  priority: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],  // This is an array of strings
    required: true,
  },
  estimatedTime: {
    type: Number,  // Store the estimated time as a number (minutes or hours)
    default: 0,
  },
  assignedTo: {
    type: String,
    default: 'Unassigned',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Assuming you're associating tasks with users
    required: true,
  },
});

module.exports = mongoose.model('Task', taskSchema);
