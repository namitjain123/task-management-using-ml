// src/components/Logout.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear the token from local storage
    localStorage.removeItem('token');
    
    // Redirect to the login page
    navigate('/login');
  }, [navigate]);

  return (
    <div>
      <h2>You have been logged out successfully!</h2>
    </div>
  );
};

export default Logout;
