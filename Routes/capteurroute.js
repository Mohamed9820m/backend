const express = require('express');
const router = express.Router();
const { insertData } = require('../controllers/captController');

router.post('/insertData/:reference', insertData);

module.exports = router;
