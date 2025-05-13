// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import TaskList from './components/Tasklist';
import TaskForm from './components/TaskForm';
import Logout from './components/Logout';  // Make sure to import it




const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/tasks" element={<TaskList />} />
      <Route path="/tasks/new" element={<TaskForm />} />
      <Route path="/tasks/edit/:id" element={<TaskForm />} />
      <Route path="/logout" element={<Logout />} />

    </Routes>
  );
};

export default App;

