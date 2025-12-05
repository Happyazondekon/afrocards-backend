const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InventaireBadge = sequelize.define('InventaireBadge', {
  idInventaireBadge: {
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
  idBadge: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'badges',
      key: 'id_badge'
    }
  },
  dateObtention: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  affiche: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Badge affiché sur le profil'
  }
}, {
  tableName: 'inventaire_badges',
  timestamps: true,
  createdAt: 'dateObtention',
  updatedAt: false
});

module.exports = InventaireBadge;