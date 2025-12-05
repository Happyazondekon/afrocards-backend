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
    defaultValue: 5,
    validate: {
      min: 0,
      max: 10
    },
    comment: 'Points de vie disponibles'
  },
  derniereRecharge: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Date de dernière recharge automatique'
  }
}, {
  tableName: 'points_vie',
  timestamps: true
});

module.exports = PointsVie;