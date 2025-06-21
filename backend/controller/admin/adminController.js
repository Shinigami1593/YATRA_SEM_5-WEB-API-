const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../../models/admin/Admin');
const User = require('../../models/User');

exports.signup = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Admin model defined:', !!Admin);
    const { name, email, password, firstName, lastName, role } = req.body;
    if (!name || !email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'All fields (name, email, password, firstName, lastName) are required' });
    }
    const assignedRole = role || 'admin'; // Use provided role or default to 'admin'
    if (await Admin.findOne({ email })) return res.status(400).json({ message: 'Email in use' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const admin = new Admin({ name: `${firstName} ${lastName}`, email, password: hashedPassword, firstName, lastName, role: assignedRole });
    await admin.save();

    console.log('JWT_SECRET:', process.env.SECRET);
    const token = jwt.sign({ adminId: admin._id, role: assignedRole }, process.env.SECRET, { expiresIn: '1d' });
    res.status(201).json({ message: 'Admin created', token, admin: { id: admin._id, name, email, firstName, lastName, role: assignedRole } });
  } catch (error) {
    console.error('Signup error:', error.message, error.stack);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Email already in use' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email }).select('email password role');
    if (!admin || !await bcrypt.compare(password, admin.password)) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ adminId: admin._id, role: admin.role }, process.env.SECRET, { expiresIn: '1d' });
    res.status(200).json({ message: 'Login successful', token, admin: { id: admin._id, email } });
  } catch (error) {
    console.error('Login error:', error.message, error.stack);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select('-password');
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.status(200).json(admin);
  } catch (error) {
    console.error('Get profile error:', error.message, error.stack);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    console.log('Update request body:', req.body);
    console.log('File received:', req.file);
    const { name, email, password, firstName, lastName, role } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) updateData.password = await bcrypt.hash(password, await bcrypt.genSalt(10));
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (role) updateData.role = role;
    if (req.file) updateData.profilePicture = req.file.filename; // Only updated here for admin profile

    const admin = await Admin.findByIdAndUpdate(req.admin._id, updateData, { new: true, runValidators: true }).select('-password');
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.status(200).json({ message: 'Profile updated', admin });
  } catch (error) {
    console.error('Update profile error:', error.message, error.stack);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteProfile = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.admin._id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.status(200).json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Delete profile error:', error.message, error.stack);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Get users error:', error.message, error.stack);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, firstName, lastName } = req.body;
    if (!name || !email || !password || !firstName || !lastName) return res.status(400).json({ message: 'All fields are required' });
    if (await User.findOne({ email })) return res.status(400).json({ message: 'Email in use' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({ name, email, password: hashedPassword, firstName, lastName });
    await user.save();
    res.status(201).json({ message: 'User created', user: { id: user._id, name, email, firstName, lastName } });
  } catch (error) {
    console.error('Create user error:', error.message, error.stack);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, firstName, lastName } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) updateData.password = await bcrypt.hash(password, await bcrypt.genSalt(10));
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    // Removed profilePicture update for users
    // if (req.file) updateData.profilePicture = req.file.filename; // Commented out

    const user = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User updated', user });
  } catch (error) {
    console.error('Update user error:', error.message, error.stack);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    console.error('Delete user error:', error.message, error.stack);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getDashboardData = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const adminCount = await Admin.countDocuments();
    res.status(200).json({ userCount, adminCount });
  } catch (error) {
    console.error('Dashboard error:', error.message, error.stack);
    res.status(500).json({ message: 'Server error' });
  }
};