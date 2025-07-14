const express = require('express');
const router = express.Router();
const stopController = require('../controller/stopsController');
const { authenticateUser, isAdmin } = require('../middleware/auth');

// User-accessible routes (active stops only)
router.get('/', authenticateUser, stopController.getStops);
router.get('/nearby', authenticateUser, stopController.getStops);
router.get('/:id', authenticateUser, stopController.getStopById);

// Admin-only routes
router.post('/admin/create', authenticateUser, isAdmin, stopController.createStop);
router.get('/admin', authenticateUser, isAdmin, stopController.getAdminStops);
router.get('/admin/nearby', authenticateUser, isAdmin, stopController.getAdminStops);
router.get('/admin/:id', authenticateUser, isAdmin, stopController.getAdminStopById);
router.put('/admin/:id', authenticateUser, isAdmin, stopController.updateStop);
router.delete('/admin/:id', authenticateUser, isAdmin, stopController.deleteStop);

module.exports = router;