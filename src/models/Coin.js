const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Coin = sequelize.define('Coin', {
  idCoin: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idJoueur: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true, // Un seul portefeuille par joueur
    references: {
      model: 'joueurs',
      key: 'id_joueur'
    }
  },
  solde: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  devise: {
    type: DataTypes.STRING(10),
    defaultValue: 'COIN'
  }
}, {
  tableName: 'coins',
  timestamps: true
});

module.exports = Coin;