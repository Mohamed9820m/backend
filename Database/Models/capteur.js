const { DataTypes, Model } = require('sequelize');
const sequelize = require('../configdb');
const Configuration = require('./configurationT');
const Setting = require('./settings');

class Data extends Model {}

Data.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  configurationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  settingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  datetime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  temp: {
    type: DataTypes.FLOAT, // Assuming temperature is a float value
    allowNull: false,
  },
  humidity: {
    type: DataTypes.FLOAT, // Assuming humidity is a float value
    allowNull: false,
  },
  longitude: {
    type: DataTypes.FLOAT, // Assuming longitude is a float value
    allowNull: false,
  },
  latitude: {
    type: DataTypes.FLOAT, // Assuming latitude is a float value
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  solde: {
    type: DataTypes.INTEGER, // Assuming solde is an integer value
    allowNull: false,
  },
  soldeValable: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  soldeInternet: {
    type: DataTypes.INTEGER, // Assuming soldeInternet is an integer value
    allowNull: false,
  },
  soldeInternetValable: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Data',
});

Data.belongsTo(Configuration, { foreignKey: 'configurationId' });
Data.belongsTo(Setting, { foreignKey: 'settingId' });

module.exports = Data;
