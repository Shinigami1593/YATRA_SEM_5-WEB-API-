const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjusted path

exports.authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('Token received:', authHeader);
    if (!authHeader) {
      return res.status(403).json({
        success: false,
        message: 'Token required'
      });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.SECRET);
    console.log('Decoded token:', decoded); // Add this line
    const userId = decoded.userId; // Ensure this matches the token field
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }
    req.user = user;
    console.log('Authenticated user:', req.user);
    next();
  } catch (err) {
    console.error('Authentication error:', err.message, err.stack);
    return res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Authentication failed, not admin'
    });
  }
};

exports.validateSignup = (req, res, next) => {
  
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }
  next();
};


exports.validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  next();
};
