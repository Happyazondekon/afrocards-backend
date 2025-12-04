const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Explication = sequelize.define('Explication', {
  idExplication: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idQuestion: {
  type: DataTypes.INTEGER,
  allowNull: false,
  unique: true,
  references: {
    model: 'questions',
    key: 'id_question' // CHANGE THIS: was 'idQuestion'
  }
},
  texte: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  source: {
    type: DataTypes.STRING(300),
    allowNull: true,
    comment: 'Source de l\'information (livre, site web, etc.)'
  },
  lienRessource: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'Lien vers une ressource externe'
  }
}, {
  tableName: 'explications',
  timestamps: true
});

module.exports = Explication;