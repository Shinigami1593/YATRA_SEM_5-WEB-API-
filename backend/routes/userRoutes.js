const express = require('express');
const router = express.Router();
const routeController = require('../controller/routeController');
const authController = require('../controller/authController');
const { authenticateUser, validateSignup, validateLogin } = require('../middleware/auth');

router.post('/register', validateSignup, authController.register);
router.post('/login', validateLogin, authController.userLogin);
router.get('/profile', authenticateUser, authController.getProfile);
router.put('/profile', authenticateUser, authController.updateProfile);
router.delete('/profile', authenticateUser, authController.deleteProfile);

router.get('/routes', authenticateUser, routeController.getRoutes);
router.get('/routes/nearby', authenticateUser, routeController.getRoutes);
router.get('/routes/:id', authenticateUser, routeController.getRouteById);

module.exports = router;
      