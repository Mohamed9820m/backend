const express = require('express');
const { registerUser, loginUser } = require('../Controllers/userController');
const logTokenMiddleware = require('../middleware/tokenlogger');

const router = express.Router();

router.post('/login', loginUser);

router.post('/register', registerUser);

module.exports = router;
