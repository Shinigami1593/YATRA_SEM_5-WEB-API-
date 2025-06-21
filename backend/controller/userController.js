const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
// const path = require('path');
// const multer = require('multer');

// Configure multer storage
exports.signup = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    const { name, email, password, firstName, lastName } = req.body;
    if (!name || !email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'All fields (name, email, password, firstName, lastName) are required' });
    }
    const assignedRole = 'user'; // Default role for users
    if (await User.findOne({ email })) return res.status(400).json({ message: 'Email in use' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({ name: `${firstName} ${lastName}`, email, password: hashedPassword, firstName, lastName, role: assignedRole });
    await user.save();

    console.log('JWT_SECRET:', process.env.SECRET);
    const token = jwt.sign({ userId: user._id, role: assignedRole }, process.env.SECRET, { expiresIn: '1d' });
    res.status(201).json({ message: 'User created', token, user: { id: user._id, name, email, firstName, lastName } });
  } catch (error) {
    console.error('Signup error:', error.message, error.stack);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('email password role'); // Include role
    if (!user || !await bcrypt.compare(password, user.password)) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.SECRET, { expiresIn: '1d' });
    res.status(200).json({ message: 'Login successful', token, user: { id: user._id, email } }); // Role in token
  } catch (error) {
    console.error('Login error:', error.message, error.stack);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    console.log('Update request body:', req.body);
    console.log('File received:', req.file);
    const { name, email, password, firstName, lastName } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) updateData.password = await bcrypt.hash(password, await bcrypt.genSalt(10));
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (req.file) updateData.profilePicture = req.file.filename;

    const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true, runValidators: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'Profile updated', user });
  } catch (error) {
    console.error('Update profile error:', error.message, error.stack);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteProfile = async (req, res) => { // New function
  try {
    const user = await User.findByIdAndDelete(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Delete profile error:', error.message, error.stack);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getDashboardData = async (req, res) => {
  try {
    const userCount = await User.countDocuments({ role: 'user' });
    res.status(200).json({ userCount });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};