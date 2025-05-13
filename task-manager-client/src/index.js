// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';  // Update to use 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'; 
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));  // Create a root
root.render(  // Use render on the created root
  <React.StrictMode>
    <BrowserRouter>
    <App />
    </BrowserRouter>

  </React.StrictMode>
);
