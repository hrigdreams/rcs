const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Coldstart = sequelize.define('Coldstart', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  tag_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'tags',
      key: 'tag_id'
    }
  }
}, {
  tableName: 'coldstart',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Coldstart;