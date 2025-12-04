const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Reponse = sequelize.define('Reponse', {
  idReponse: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idQuestion: {
  type: DataTypes.INTEGER,
  allowNull: false,
  references: {
    model: 'questions',
    key: 'id_question' // CHANGE THIS: was 'idQuestion'
  }
},
  texte: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  estCorrecte: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  ordreAffichage: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    comment: 'Ordre d\'affichage de la réponse'
  }
}, {
  tableName: 'reponses',
  timestamps: true
});

module.exports = Reponse;