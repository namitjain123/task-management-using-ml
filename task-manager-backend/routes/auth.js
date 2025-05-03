// routes/auth.js
const express = require('express');
const router = express.Router();
const { signup, login,refreshToken } = require('../controllers/authController');


// Register
router.post('/signup', signup);

// Login
router.post('/login', login);

router.post('/refresh', refreshToken);

module.exports = router;
