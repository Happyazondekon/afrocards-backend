const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const XP = sequelize.define('XP', {
  idXP: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idJoueur: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'joueurs',
      key: 'id_joueur'
    }
  },
  niveau: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    validate: {
      min: 1
    }
  },
  xpActuel: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  xpProchainNiveau: {
    type: DataTypes.INTEGER,
    defaultValue: 100,
    comment: 'XP nécessaire pour atteindre le prochain niveau'
  },
  progression: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    },
    comment: 'Pourcentage de progression vers le prochain niveau'
  },
  dateMaj: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'xp',
  timestamps: true,
  updatedAt: 'dateMaj'
});

module.exports = XP;