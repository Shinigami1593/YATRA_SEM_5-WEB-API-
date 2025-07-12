const express = require('express');
const router = express.Router();
const routeController = require('../../controller/routeController');
const authController = require('../../controller/authController');
const { authenticateUser, isAdmin } = require('../../middleware/auth');

router.post('/register', authController.adminRegister);
router.post('/login', authController.adminLogin);
router.get('/users', authenticateUser, isAdmin, authController.getUsers);
router.get('/users/:id', authenticateUser, isAdmin, authController.getUserById);
router.put('/users/:id', authenticateUser, isAdmin, authController.updateUser);
router.delete('/users/:id', authenticateUser, isAdmin, authController.deleteUser);

router.post('/routes/create', authenticateUser, isAdmin, routeController.createRoute);
router.get('/routes', authenticateUser, isAdmin, routeController.getAllRoutesAdmin);
router.get('/routes/inactive', authenticateUser, isAdmin, routeController.getInactiveRoutes);
router.get('/routes/:id', authenticateUser, isAdmin, routeController.getRouteById);
router.patch('/routes/:id/activate', authenticateUser, isAdmin, routeController.activateRoute);
router.put('/routes/:id', authenticateUser, isAdmin, routeController.updateRoute);
router.delete('/routes/:id', authenticateUser, isAdmin, routeController.deleteRoute);

module.exports = router;
