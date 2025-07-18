const express = require('express');
const router = express.Router();
const tripScheduleController = require('../controller/tripScheduleController');
const { authenticateUser, isAdmin } = require('../middleware/auth');

// User routes - can view trips
router.get('/', authenticateUser, tripScheduleController.getTripSchedules);
router.get('/:id', authenticateUser, tripScheduleController.getTripScheduleById);

// Admin routes - create, update, delete trips
// router.get('/trip-schedule',authenticateUser, isAdmin, tripScheduleController.getTripSchedules)
router.post('/admin', authenticateUser, isAdmin, tripScheduleController.createTripSchedule);
router.put('/admin/:id', authenticateUser, isAdmin, tripScheduleController.updateTripSchedule);
router.delete('/admin/:id', authenticateUser, isAdmin, tripScheduleController.deleteTripSchedule);

module.exports = router;
