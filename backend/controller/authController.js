const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/admin/Admin');

exports.register = async (req, res) => {
  try {
    const { name, email, password, firstName, lastName } = req.body;
    if (!name || !email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'All fields (name, email, password, firstName, lastName) are required' });
    }
    if (await User.findOne({ email })) return res.status(400).json({ message: 'Email in use' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({ name, email, password: hashedPassword, firstName, lastName, role: 'user' });
    await user.save();

    const token = jwt.sign({ userId: user._id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ message: 'User created', token, user: { id: user._id, name, email, firstName, lastName } });
  } catch (error) {
    console.error('Register error:', error.message, error.stack);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.adminRegister = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    if (await User.findOne({ email }) || await Admin.findOne({ email })) {
      return res.status(400).json({ message: 'Email in use' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const admin = new Admin({ email, password: hashedPassword, role: 'admin' });
    await admin.save();

    const token = jwt.sign({ userId: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '20d' });
    res.status(201).json({ message: 'Admin created', token, user: { id: admin._id, email, role: 'admin' } });
  } catch (error) {
    console.error('Admin register error:', error.message, error.stack);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('email password role');
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ message: 'Login successful', token, user: { id: user._id, email, role: user.role } });
  } catch (error) {
    console.error('User login error:', error.message, error.stack);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email }).select('email password role');
    if (!admin || !await bcrypt.compare(password, admin.password)) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ message: 'Admin login successful', token, user: { id: admin._id, email, role: admin.role } });
  } catch (error) {
    console.error('Admin login error:', error.message, error.stack);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    let user;
    if (req.user.role === 'admin') {
      user = await Admin.findById(req.user.userId).select('-password');
    } else {
      user = await User.findById(req.user.userId).select('-password');
    }
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    console.error('Get profile error:', error.message, error.stack);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email, password, firstName, lastName } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.user.userId } }) || 
                          await Admin.findOne({ email, _id: { $ne: req.user.userId } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      updateData.email = email;
    }
    if (password) updateData.password = await bcrypt.hash(password, await bcrypt.genSalt(10));
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (req.file) updateData.profilePicture = `/uploads/${req.file.filename}`;

    let user;
    if (req.user.role === 'admin') {
      user = await Admin.findByIdAndUpdate(req.user.userId, { email: updateData.email, password: updateData.password }, { new: true, runValidators: true }).select('-password');
    } else {
      user = await User.findByIdAndUpdate(req.user.userId, updateData, { new: true, runValidators: true }).select('-password');
    }
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'Profile updated', user });
  } catch (error) {
    console.error('Update profile error:', error.message, error.stack);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteProfile = async (req, res) => {
  try {
    let user;
    if (req.user.role === 'admin') {
      user = await Admin.findByIdAndDelete(req.user.userId);
    } else {
      user = await User.findByIdAndDelete(req.user.userId);
    }
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Delete profile error:', error.message, error.stack);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.status(200).json({ users });
  } catch (error) {
    console.error('Get users error:', error.message, error.stack);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    console.error('Get user error:', error.message, error.stack);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email, password, firstName, lastName, role } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (email) {
      if (await User.findOne({ email, _id: { $ne: req.params.id } }) || 
          await Admin.findOne({ email })) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      updateData.email = email;
    }
    if (password) updateData.password = await bcrypt.hash(password, await bcrypt.genSalt(10));
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (role && ['user', 'admin'].includes(role)) updateData.role = role;
    if (req.file) updateData.profilePicture = `/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User updated', user });
  } catch (error) {
    console.error('Update user error:', error.message, error.stack);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error.message, error.stack);
    res.status(500).json({ message: 'Server error' });
  }
};