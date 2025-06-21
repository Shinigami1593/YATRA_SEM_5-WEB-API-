const express = require('express');
const router = express.Router();
const { signup, login, getUsers, createUser, updateUser, deleteUser, getDashboardData, deleteProfile } = require('../../controller/admin/adminController');
const middleware = require('../../middleware/admin/adminAuth'); 
const upload = require('../../middleware/upload')

router.post('/signup', middleware.validateAdminSignup, signup);
router.post('/login', middleware.validateAdminLogin, login);
router.get('/users', middleware.authenticateAdmin, getUsers);
router.post('/users', middleware.authenticateAdmin, createUser); // No file upload
router.put('/users/:id', middleware.authenticateAdmin, upload.single('profilePicture'), updateUser); // File upload only here
router.delete('/users/:id', middleware.authenticateAdmin, deleteUser);
router.get('/dashboard', middleware.authenticateAdmin, getDashboardData);
router.delete('/users/:id', middleware.authenticateAdmin, deleteUser);
router.delete('/profile', middleware.authenticateAdmin, deleteProfile);

module.exports = router;