const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Restaurant = sequelize.define('Restaurant', {
  restaurant_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  r_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  r_desc: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  r_location: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'restaurants',
  timestamps: false
});

module.exports = Restaurant;