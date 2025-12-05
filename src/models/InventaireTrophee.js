const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InventaireTrophee = sequelize.define('InventaireTrophee', {
  idInventaireTrophee: {
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
  },
  affiche: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Trophée affiché sur le profil'
  }
}, {
  tableName: 'inventaire_trophees',
  timestamps: true,
  createdAt: 'dateObtention',
  updatedAt: false
});

module.exports = InventaireTrophee;