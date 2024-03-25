const express = require('express');
const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const Setting = require('../Database/Models/settings');
const Configuration = require('../Database/Models/configurationT');
const sequelize = require('../Database/configdb');

const router = express.Router();

async function generateTokenController(reference, code) {
  try {
    const setting = await Setting.findOne({
      where: { reference, code },
    });

    if (setting) {
      if (setting.token && !isTokenExpired(setting.token)) {
        return setting.token;
      }

      const configurationId = setting.configurationId;
      const expirationTime = Math.floor(Date.now() / 1000) + (24 * 60 * 60);
      const tokenPayload = { settingId: setting.id, configurationId };
      const token = jwt.sign(tokenPayload, 'your_secret_key', { expiresIn: expirationTime });

      setting.token = token;
      await setting.save();

      return token;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error generating token:', error);
    throw error;
  }
}

function isTokenExpired(token) {
  const decoded = jwt.decode(token);
  if (!decoded || !decoded.exp) {
    return true;
  }
  return decoded.exp * 1000 < Date.now(); 
}

async function deleteExpiredTokens() {
  try {
    const expiredSettings = await Setting.findAll({
      where: {
        token: { [Sequelize.Op.ne]: null },
        updatedAt: { [Sequelize.Op.lt]: new Date(Date.now() - (24 * 60 * 60 * 1000)) }
      }
    });

    await Promise.all(expiredSettings.map(setting => {
      setting.token = null;
      return setting.save();
    }));
  } catch (error) {
    console.error('Error deleting expired tokens:', error);
  }
}

setInterval(deleteExpiredTokens, 24 * 60 * 60 * 1000);

router.post('/generateToken', async (req, res) => {
  const { reference, code } = req.body;

  try {
    const token = await generateTokenController(reference, code);

    if (token) {
      res.setHeader('Authorization', `Bearer ${token}`);
      res.status(200).json({ token });
    } else {
      res.status(404).json({ error: 'Setting not found' });
    }
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
