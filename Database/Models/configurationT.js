const { DataTypes, Model } = require('sequelize');
const sequelize = require('../configdb');
const User = require('./User');
const Setting = require('./settings');

class Configuration extends Model {}

Configuration.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  maxTemperature: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  minTemperature: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  maxHumidity: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  minHumidity: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  settingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    unique: true, // Enforce uniqueness on settingId
  },
}, {
  sequelize,
  modelName: 'Configuration',
});

Configuration.belongsTo(User, { foreignKey: 'userId' });
Configuration.belongsTo(Setting, { foreignKey: 'settingId', as: 'setting' });

module.exports = Configuration;
