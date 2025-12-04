const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Question = sequelize.define('Question', {
  idQuestion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // In Question.js
idQuiz: {
  type: DataTypes.INTEGER,
  allowNull: false,
  references: {
    model: 'quiz',
    key: 'id_quiz' // CHANGE THIS: was 'idQuiz'
  }
},
  texte: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('QCM', 'VraiFaux', 'Completion'),
    defaultValue: 'QCM'
  },
  priorite: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    comment: 'Priorité d\'affichage (1 = haute, 5 = basse)'
  },
  mediaURL: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'URL d\'une image ou vidéo illustrant la question'
  }
}, {
  tableName: 'questions',
  timestamps: true
});

module.exports = Question;