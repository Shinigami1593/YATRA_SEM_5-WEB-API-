const jwt = require('jsonwebtoken');
const Admin = require('../../models/admin/Admin');

exports.authenticateAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('Token received:', authHeader);
    if (!authHeader) {
      return res.status(403).json({
        success: false,
        message: 'Token required',
      });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.SECRET);
    console.log('Decoded token:', decoded);
    const adminId = decoded.adminId;
    const admin = await Admin.findOne({ _id: adminId });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Admin not found',
      });
    }
    if (!['superadmin', 'moderator'].includes(admin.role)) {
      return res.status(403).json({
        success: false,
        message: 'Authentication failed, not an admin',
      });
    }
    req.admin = admin;
    console.log('Authenticated admin:', req.admin);
    next();
  } catch (err) {
    console.error('Authentication error:', err.message, err.stack);
    return res.status(500).json({
      success: false,
      message: 'Authentication error',
    });
  }
};

exports.validateAdminSignup = (req, res, next) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
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

exports.validateAdminLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  next();
};