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
    default: null,
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],  // You can use a limited set of priority values
    default: 'Medium',
  },
  tags: {
    type: [String],  // This is an array of strings
    default: [],
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
