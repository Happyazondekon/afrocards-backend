const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Trophee = sequelize.define('Trophee', {
  idTrophee: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  icone: {
    type: DataTypes.STRING(500),
    allowNull: true,
    defaultValue: '/trophees/default.png'
  },
  rarete: {
    type: DataTypes.ENUM('bronze', 'argent', 'or', 'platine', 'diamant'),
    defaultValue: 'bronze'
  },
  condition: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Conditions pour obtenir le trophée'
  }
}, {
  tableName: 'trophees',
  timestamps: true
});

module.exports = Trophee;