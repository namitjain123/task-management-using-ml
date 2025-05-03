// middleware/authenticate.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');  // Extract token
  if (!token) return res.status(401).send('Access denied');  // If no token, return 401

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);  // Verify the token
    req.user = verified;  // Attach user info to request
    next();  // Proceed to the next route handler
  } catch (err) {
    res.status(403).send('Invalid or expired token');  // If token is invalid or expired
  }
};
