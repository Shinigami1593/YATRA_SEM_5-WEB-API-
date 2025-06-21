const express = require('express');
const router = express.Router();
const controller = require('../controllers/routeController');

router.post('/', controller.addRoute);
router.get('/', controller.getRoutes);
router.put('/:id', controller.updateRoute);
router.delete('/:id', controller.deleteRoute);

module.exports = router;
