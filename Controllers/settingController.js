const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const Setting = require('../Database/Models/settings');
const Configuration = require('../Database/Models/configurationT'); // Import the Configuration model
const sequelize = require('../Database/configdb'); // Import the sequelize instance

async function generateTokenController(reference, code) {
  try {
    // Find the setting based on reference and code
    const setting = await Setting.findOne({
      where: { reference, code },
    });

    if (setting) {
      if (setting.token && !isTokenExpired(setting.token)) {
        return setting.token; // Return existing token if not expired
      }

      // Retrieve the associated configurationId from the Setting
      const configurationId = setting.configurationId;

      // Generate a new token with configurationId in the payload
      // const expirationTime = Math.floor(Date.now() / 1000) + 30; // Token expires in 30 seconds
      const expirationTime = Math.floor(Date.now() / 1000) + (24 * 60 * 60); // Token expires in 24 hours

      const tokenPayload = { settingId: setting.id, configurationId };
      const token = jwt.sign(tokenPayload, 'your_secret_key', { expiresIn: expirationTime });

      // Update setting with the new token
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
        // updatedAt: { [Sequelize.Op.lt]: new Date(Date.now() - (30 * 1000)) } // Delete tokens older than 30 seconds
        updatedAt: { [Sequelize.Op.lt]: new Date(Date.now() - (24 * 60 * 60 * 1000)) } // Delete tokens older than 24 hours

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

setInterval(deleteExpiredTokens, 24 * 60 * 60 * 1000); // Check for expired tokens every 24 hours

// setInterval(deleteExpiredTokens, 30 * 1000); 

module.exports = { generateTokenController };
