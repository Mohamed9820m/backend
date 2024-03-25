const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Data = require('../Database/Models/capteur');
const Setting = require('../Database/Models/settings'); 
const Configuration = require('../Database/Models/configurationT'); 

const insertData = async (req, res) => {
  try {
    // Retrieve reference from request parameters
    const { reference } = req.params;

    // Retrieve setting details from the database using the reference
    const setting = await Setting.findOne({ where: { reference } });
    
    if (!setting || !setting.token) {
      return res.status(400).json({ error: 'Thermo is not connected' });
    }

    const token = setting.token;

    // Verify if token is expired
    const decodedToken = jwt.decode(token);
    if (!decodedToken || (decodedToken.exp * 1000) < Date.now()) {
      return res.status(400).json({ error: 'Thermo token is expired' });
    }

    const { settingId, configurationId } = jwt.verify(token, 'your_secret_key');

    const existingSetting = await Setting.findByPk(settingId);
    const existingConfiguration = await Configuration.findByPk(configurationId);
    if (!existingSetting || !existingConfiguration) {
      return res.status(404).json({ error: 'Setting or Configuration not found' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { temp, humidity, longitude, latitude, date, solde, soldeValable, soldeInternet, soldeInternetValable } = req.body;

    const newData = await Data.create({
      settingId,
      configurationId,
      temp,
      humidity,
      longitude,
      latitude,
      date,
      solde,
      soldeValable,
      soldeInternet,
      soldeInternetValable,
    });

    const configurationDetails = await Configuration.findByPk(configurationId);

    res.status(201).json({ configurationDetails });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { insertData };
