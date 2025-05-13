// src/components/TaskList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Function to check if the JWT token has expired
  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;  // Current time in seconds
      return decoded.exp < currentTime; // Token is expired if current time > expiration time
    } catch (err) {
      return true; // If the token is invalid or cannot be decoded, consider it expired
    }
  };

  // Function to refresh the JWT token
  const refreshToken = async () => {
    const storedRefreshToken = localStorage.getItem('refreshToken');

    if (!storedRefreshToken) {
      setError('You need to log in again.');
      navigate('/login'); // Redirect to login if there's no refresh token
      return null;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/refresh', {
        refreshToken: storedRefreshToken,
      });

      const newToken = response.data.token;
      localStorage.setItem('token', newToken);  // Store the new JWT token
      return newToken;
    } catch (err) {
      console.error('Failed to refresh token:', err);
      localStorage.removeItem('token');  // Remove invalid token
      localStorage.removeItem('refreshToken');  // Remove refresh token
      navigate('/login');  // Redirect to login if refresh fails
      return null;
    }
  };

  // Fetch tasks from the API
  const fetchTasks = async () => {
    try {
      let token = localStorage.getItem('token');

      // Check if the token is expired
      if (token && isTokenExpired(token)) {
        token = await refreshToken();  // Refresh token if expired
        if (!token) return; // If token refresh failed, stop further execution
      }

      const response = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTasks(response.data);  // Update the task list
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks');
    }
  };

  // Call fetchTasks when component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  // Delete a task
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((task) => task._id !== id)); // Remove deleted task from list
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task');
    }
  };

  return (
    <div>
      <h2>Your Tasks</h2>
      <Link to="/tasks/new">Create New Task</Link>
      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Due Date: {task.dueDate}</p>
            <p>Priority: {task.priority}</p>
            <p>Tags: {task.tags.join(', ')}</p>
            <p>Estimated Time: {task.estimatedTime} hours</p>
            <p>Assigned To: {task.assignedTo}</p>
            <button onClick={() => handleDelete(task._id)}>Delete</button>
            <Link to={`/tasks/edit/${task._id}`}>Edit</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
