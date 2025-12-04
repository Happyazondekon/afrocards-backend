const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ModeJeu = sequelize.define('ModeJeu', {
  idMode: {
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
  regles: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  type: {
    type: DataTypes.ENUM('solo', 'multi', 'tournoi'),
    defaultValue: 'solo'
  }
}, {
  tableName: 'modes_jeu',
  timestamps: true
});

module.exports = ModeJeu;