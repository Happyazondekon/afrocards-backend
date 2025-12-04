const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Joueur = sequelize.define('Joueur', {
  idJoueur: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // In Joueur.js

idUtilisateur: {
  type: DataTypes.INTEGER,
  allowNull: false,
  unique: true,
  references: {
    model: 'utilisateurs', // This matches the table name
    key: 'id_utilisateur'  // CHANGE THIS: from 'idUtilisateur' to 'id_utilisateur'
  }
},
  pseudo: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  avatarURL: {
    type: DataTypes.STRING(500),
    allowNull: true,
    defaultValue: '/avatars/default.png'
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 13,
      max: 120
    }
  },
  pays: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  nationalite: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  scoreTotal: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  niveau: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    validate: {
      min: 1
    }
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  statutPremium: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  dateInscription: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'joueurs',
  timestamps: true,
  createdAt: 'dateInscription',
  updatedAt: false
});

module.exports = Joueur;