const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Quiz = sequelize.define('Quiz', {
  idQuiz: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titre: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  difficulte: {
    type: DataTypes.ENUM('facile', 'moyen', 'difficile', 'expert'),
    defaultValue: 'moyen'
  },
  langue: {
    type: DataTypes.STRING(10),
    defaultValue: 'fr',
    allowNull: false
  },
  duree: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Durée en secondes'
  },
  statut: {
    type: DataTypes.ENUM('actif', 'archive', 'brouillon'),
    defaultValue: 'brouillon'
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  dateCreation: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  dateMaj: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'quiz',
  timestamps: true,
  createdAt: 'dateCreation',
  updatedAt: 'dateMaj'
});

module.exports = Quiz;