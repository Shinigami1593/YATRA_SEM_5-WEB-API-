const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log('Signup request received:', { name, email }); // Debug log

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Email already in use:', email); // Debug log
      return res.status(400).json({ message: 'Email already in use' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    console.log('User saved to MongoDB:', user); // Debug log

    const token = jwt.sign({ userId: user._id }, process.env.SECRET, { expiresIn: '1d' });

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: user._id, name, email },
    });
  } catch (error) {
    console.error('Signup error:', error.message, error.stack); // Enhanced debug log
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login request received:', { email }); // Debug log

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email); // Debug log
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch for:', email); // Debug log
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET, { expiresIn: '1d' });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email },
    });
  } catch (error) {
    console.error('Login error:', error.message, error.stack); // Enhanced debug log
    res.status(500).json({ message: 'Server error' });
  }
};