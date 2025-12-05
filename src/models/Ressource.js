const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Classe abstraite Ressource (ne sera pas créée en table directement)
const Ressource = sequelize.define('Ressource', {
  idRessource: {
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
  nom: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  solde: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  dateMaj: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'ressources',
  timestamps: true,
  updatedAt: 'dateMaj'
});

module.exports = Ressource;