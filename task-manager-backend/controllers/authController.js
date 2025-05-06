// controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register a new user
exports.signup = async (req, res) => {
  console.log('\n=== SIGNUP ===');
  console.log(req.body);
  const { username, email, password } = req.body;
  console.log(`Entered password: [${password}]`);
  console.log(`Char codes:`, password.split('').map(c => c.charCodeAt(0)));

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password.trim(), salt);

    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    console.log('User created with hashed password:', hashedPassword);
    res.status(201).send('User created');
  } catch (err) {
    console.error(err);
    res.status(400).send(err.message);
  }
};
// Login
exports.login = async (req, res) => {
  console.log('\n=== LOGIN ===');
  const { email, password } = req.body;
  console.log(`Entered password: [${password}]`);
  console.log(`Char codes:`, password.split('').map(c => c.charCodeAt(0)));

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('Stored hash:', user.password);

    const isMatch = await bcrypt.compare(password.trim(), user.password);
    console.log('Password match result:', isMatch);

    // if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const payload = { userId: user._id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, refreshToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// controllers/authController.js
exports.refreshToken = (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token required' });
  }

  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const newToken = jwt.sign(
      { userId: decoded.userId, email: decoded.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token: newToken });
  });
};

