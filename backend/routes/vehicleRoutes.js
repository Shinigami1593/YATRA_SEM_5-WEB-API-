const express = require('express');
const router = express.Router();
const vehicleController = require('../controller/vehicleController');
const { authenticateUser, isAdmin } = require('../middleware/auth');

// Public (user) access — view available vehicles
router.get('/', authenticateUser, vehicleController.getVehicles);
router.get('/:id', authenticateUser, vehicleController.getVehicleById);

// Admin-only for managing vehicles
router.post('/admin', authenticateUser, isAdmin, vehicleController.createVehicle);
router.get('/admin', authenticateUser, isAdmin, vehicleController.getVehicles);
router.get('/admin/:id', authenticateUser, isAdmin, vehicleController.getVehicleById);
router.put('/admin/:id', authenticateUser, isAdmin, vehicleController.updateVehicle);
router.delete('/admin/:id', authenticateUser, isAdmin, vehicleController.deleteVehicle);

module.exports = router;
