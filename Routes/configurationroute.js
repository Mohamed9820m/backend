const express = require('express');
const { insertConfiguration,updateConfiguration,getAllConfigurations } = require('../Controllers/configController');
const router = express.Router();

router.post('/add', insertConfiguration);

router.put('/update/:reference', updateConfiguration);

router.get('/getByUserId/:userId', getAllConfigurations);



module.exports = router;