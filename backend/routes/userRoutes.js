const express = require('express');
const router = express.Router();
const { validateSignup, validateLogin } = require('../middleware/auth');
const { signup, login } = require('../controller/userController');

router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);

module.exports = router;