const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/admin/Admin');

exports.authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('Token received:', authHeader);
    if (!authHeader) {
      return res.status(403).json({ message: 'Token required' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    let user = await User.findById(decoded.userId).select('-password');
    let role = decoded.role;

    if (!user) {
      user = await Admin.findById(decoded.userId).select('-password');
      role = user ? user.role : null; // Use Admin model's role field
    }

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = { userId: user._id, role, ...user.toObject() };
    console.log('Authenticated user:', req.user);
    next();
  } catch (err) {
    console.error('Authentication error:', err.message, err.stack);
    return res.status(500).json({ message: 'Authentication error' });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Admin access required' });
  }
};

exports.validateSignup = (req, res, next) => {
  const { name, email, password, firstName, lastName } = req.body;
  if (!name || !email || !password || !firstName || !lastName) {
    return res.status(400).json({ message: 'All fields (name, email, password, firstName, lastName) are required' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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