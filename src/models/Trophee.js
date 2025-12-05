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
    allowNull: false
  },
  icone: {
    type: DataTypes.STRING(500),
    allowNull: true,
    defaultValue: '/trophees/default.png'
  },
  rareté: {
    type: DataTypes.ENUM('commun', 'rare', 'epique', 'legendaire'),
    defaultValue: 'commun'
  }
}, {
  tableName: 'trophees',
  timestamps: false
});

module.exports = Trophee;