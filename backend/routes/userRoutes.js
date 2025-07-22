const express = require('express');
const router = express.Router();
const routeController = require('../controller/routeController');
const authController = require('../controller/authController');
const tripScheduleController = require('../controller/tripScheduleController')
const { authenticateUser, validateSignup, validateLogin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// router.post('/upload',upload.single("image"), authController.)
router.post('/register', validateSignup, authController.register);
router.post('/login', validateLogin, authController.userLogin);
router.get('/profile', authenticateUser, authController.getProfile);
router.put('/profile', authenticateUser,upload.single('profilePicture'), authController.updateProfile);
router.delete('/profile', authenticateUser, authController.deleteProfile);

router.get('/routes', authenticateUser, routeController.getRoutes);
router.get('/routes/nearby', authenticateUser, routeController.getRoutes);
router.get('/routes/:id', authenticateUser, routeController.getRouteById);

//trip
// router.get('/trip/all,', authenticateUser, tripScheduleController.getTripSchedules);

module.exports = router;
      