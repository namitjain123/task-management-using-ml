// src/components/TaskForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'; // Using useNavigate instead of useHistory

const TaskForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [error, setError] = useState('');
  const navigate = useNavigate();  // Using useNavigate instead of useHistory
  const { id } = useParams();  // For editing existing tasks
  

  // Fetch task data for editing
  useEffect(() => {
    if (id) {
      console.log("Fetching task with ID:", id); // Debugging the task ID
      const fetchTask = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You must be logged in to edit tasks');
          return;
        }
  
        try {
          const res = await axios.get(`http://localhost:5000/api/tasks/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setTitle(res.data.title);
          setDescription(res.data.description);
          setTags(res.data.tags);
          setDueDate(res.data.dueDate);
          setEstimatedTime(res.data.estimatedTime);
          setPriority(res.data.priority ||'Medium');
        } catch (err) {
          console.error(err);
          setError('Failed to fetch task');
        }
      };
  
      fetchTask();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      let response;
      if (id) {
        // Update existing task
        response = await axios.put(`http://localhost:5000/api/tasks/${id}`, { title, description, tags, dueDate, estimatedTime }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Create new task
        response = await axios.post('http://localhost:5000/api/tasks', { title, description, tags, dueDate, estimatedTime }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      // After task creation or update, set the predicted priority
      setPriority(response.data.priority);  // Set predicted priority from the backend response
      navigate('/tasks');  // Redirect to task list after task is created/updated

    } catch (err) {
      setError('Failed to save task');
    }
  };

  return (
    <div>
      <h2>{id ? 'Edit Task' : 'Create New Task'}</h2>
      {error && <p>{error}</p>}
      {priority && <p>Predicted Priority: {priority}</p>}  {/* Display the predicted priority */}
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
        />
        <textarea 
          placeholder="Description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Tags (comma separated)" 
          value={tags} 
          onChange={(e) => setTags(e.target.value)} 
        />
        <label htmlFor="dueDate">Due Date</label>
          <input 
            id="dueDate"
            type="date" 
            value={dueDate} 
            onChange={(e) => setDueDate(e.target.value)} 
          />
        <input 
          type="number" 
          placeholder="Estimated Time (in hours)" 
          value={estimatedTime} 
          onChange={(e) => setEstimatedTime(e.target.value)} 
        />
        <button type="submit">{id ? 'Update Task' : 'Create Task'}</button>
      </form>
      <p>Task Priority: {priority}</p>  {/* Hardcoded priority display */}
    </div>
  );
};

export default TaskForm;
