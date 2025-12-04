const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Partie = sequelize.define('Partie', {
  idPartie: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // Fix Player reference
idJoueur: {
  type: DataTypes.INTEGER,
  allowNull: false,
  references: {
    model: 'joueurs',
    key: 'id_joueur' // CHANGE THIS: was 'idJoueur'
  }
},
  // Fix Quiz reference
idQuiz: {
  type: DataTypes.INTEGER,
  allowNull: false,
  references: {
    model: 'quiz',
    key: 'id_quiz' // CHANGE THIS: was 'idQuiz'
  }
},
  // Fix Mode reference
idMode: {
  type: DataTypes.INTEGER,
  allowNull: true,
  references: {
    model: 'modes_jeu',
    key: 'id_mode' // CHANGE THIS: was 'idMode'
  }
},
  dateDebut: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  dateFin: {
    type: DataTypes.DATE,
    allowNull: true
  },
  score: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  tempsTotal: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Temps en secondes'
  },
  progression: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    },
    comment: 'Pourcentage de progression'
  },
  statut: {
    type: DataTypes.ENUM('en_cours', 'termine', 'abandonne'),
    defaultValue: 'en_cours'
  },
  modeJeu: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Stage, Fiesta, Défi, etc.'
  }
}, {
  tableName: 'parties',
  timestamps: true
});

module.exports = Partie;