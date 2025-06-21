const express = require('express');
const router = express.Router();
const { signup, login, getProfile, updateProfile, getDashboardData, deleteProfile } = require('../controller/userController');
const upload = require('../middleware/upload')
const middleware = require('../middleware/auth'); 

router.post('/signup', middleware.validateSignup, signup); // No file upload
router.post('/login', middleware.validateLogin, login);
router.get('/profile', middleware.authenticateUser, getProfile);
router.put('/profile', middleware.authenticateUser, upload.single('profilePicture'), updateProfile); // File upload only here
router.get('/dashboard', middleware.authenticateUser, getDashboardData);
router.delete('/profile', middleware.authenticateUser, deleteProfile); // New route
module.exports = router;