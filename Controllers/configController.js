const { validationResult } = require('express-validator');
const Configuration = require('../Database/Models/configurationT'); 
const Setting = require('../Database/Models/settings');
const User = require('../Database/Models/user')

const insertConfiguration = async (req, res) => {
  try {
    // Validate request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Extract data from request body
    const { maxTemperature, minTemperature, maxHumidity, minHumidity, userId, settingId } = req.body;

    // Check if the provided user exists
    const existingUser = await User.findByPk(userId);
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the provided setting exists
    const existingSetting = await Setting.findByPk(settingId);
    if (!existingSetting) {
      return res.status(404).json({ error: 'Setting not found' });
    }

    // Create a new configuration
    const newConfiguration = await Configuration.create({
      maxTemperature,
      minTemperature,
      maxHumidity,
      minHumidity,
      userId,
      settingId,
    });

    // Update the configurationId in the Setting model
    await existingSetting.update({ configurationId: newConfiguration.id });

    // Return the newly created configuration
    res.status(201).json(newConfiguration);
  } catch (error) {
    console.error('Error inserting configuration:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



const updateConfiguration = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { maxTemperature, minTemperature, maxHumidity, minHumidity } = req.body;
      const { reference } = req.params;
  
      const existingConfiguration = await Configuration.findOne({
        where: { reference },
      });
  
      if (!existingConfiguration) {
        return res.status(404).json({ error: 'Configuration not found' });
      }
  
      await existingConfiguration.update({
        maxTemperature,
        minTemperature,
        maxHumidity,
        minHumidity,
      });
  
      res.status(200).json({ message: 'Configuration updated successfully' });
    } catch (error) {
      console.error('Error updating configuration:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  const getAllConfigurations = async (req, res) => {
    try {
      const userId = req.params.userId;
  
      // Assuming Configuration model has a userId field
      const configurations = await Configuration.findAll({
        where: { userId: userId },
      });
  
      res.status(200).json(configurations);
    } catch (error) {
      console.error('Error retrieving configurations by user ID:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  
  module.exports = {
    insertConfiguration,
    updateConfiguration,
    getAllConfigurations,
  };
 