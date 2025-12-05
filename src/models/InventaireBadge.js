const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InventaireBadge = sequelize.define('InventaireBadge', {
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
  }
}, {
  tableName: 'inventaire_badges',
  timestamps: false
});

module.exports = InventaireBadge;