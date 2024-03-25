const express = require('express');
const router = express.Router();
const { generateTokenController } = require('../controllers/settingController');

router.post('/generateToken', async (req, res) => {
  const { reference, code } = req.body;

  try {
    const token = await generateTokenController(reference, code);

    if (token) {
      // Set the token in the response header
      res.setHeader('Authorization', `Bearer ${token}`);
      
      // Send the token in the response body
      res.status(200).json({ token });
    } else {
      // Handle case where no token is generated
      res.status(404).json({ error: 'Setting not found' });
    }
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
