const express = require('express');
const router = express.Router();


router.post('/insertData/:reference', insertData);

module.exports = router;
