const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InventaireTrophee = sequelize.define('InventaireTrophee', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idJoueur: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'joueurs',
      key: 'id_joueur'
    }
  },
  idTrophee: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'trophees',
      key: 'id_trophee'
    }
  },
  dateObtention: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'inventaire_trophees',
  timestamps: false
});

module.exports = InventaireTrophee;