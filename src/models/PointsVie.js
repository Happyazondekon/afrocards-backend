const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PointsVie = sequelize.define('PointsVie', {
  idPointsVie: {
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
  solde: {
    type: DataTypes.INTEGER,
    defaultValue: 5, // Par défaut 5 vies
    allowNull: false,
    validate: {
      min: 0,
      max: 10 // Max 10 vies par exemple
    }
  },
  derniereRecharge: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'points_vie',
  timestamps: true
});

module.exports = PointsVie;