const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Partenaire = sequelize.define('Partenaire', {
  idPartenaire: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // In Partenaire.js

idUtilisateur: {
  type: DataTypes.INTEGER,
  allowNull: false,
  unique: true,
  references: {
    model: 'utilisateurs',
    key: 'id_utilisateur' // CHANGE THIS: from 'idUtilisateur' to 'id_utilisateur'
  }
},
  entreprise: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  secteur: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  listeContrats: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  dateInscription: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  statut: {
    type: DataTypes.ENUM('actif', 'en_attente', 'suspendu', 'inactif'),
    defaultValue: 'en_attente'
  }
}, {
  tableName: 'partenaires',
  timestamps: true,
  createdAt: 'dateInscription',
  updatedAt: false
});

module.exports = Partenaire;