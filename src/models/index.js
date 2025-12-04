const sequelize = require('../config/database');

// Import de tous les modèles
const Utilisateur = require('./Utilisateur');
const Joueur = require('./Joueur');
const Partenaire = require('./Partenaire');
const Categorie = require('./Categorie');
const Quiz = require('./Quiz');
const Question = require('./Question');
const Reponse = require('./Reponse');
const Explication = require('./Explication');
const ModeJeu = require('./ModeJeu');
const Partie = require('./Partie');

// ==========================================
// DÉFINITION DES ASSOCIATIONS
// ==========================================

const defineAssociations = () => {
  // 1. UTILISATEUR ↔ JOUEUR (1:1)
  Utilisateur.hasOne(Joueur, {
    foreignKey: 'idUtilisateur',
    onDelete: 'CASCADE'
  });
  Joueur.belongsTo(Utilisateur, {
    foreignKey: 'idUtilisateur'
  });

  // 2. UTILISATEUR ↔ PARTENAIRE (1:1)
  Utilisateur.hasOne(Partenaire, {
    foreignKey: 'idUtilisateur',
    onDelete: 'CASCADE'
  });
  Partenaire.belongsTo(Utilisateur, {
    foreignKey: 'idUtilisateur'
  });

  // 3. QUIZ ↔ QUESTION (1:N)
  Quiz.hasMany(Question, {
    foreignKey: 'idQuiz',
    onDelete: 'CASCADE'
  });
  Question.belongsTo(Quiz, {
    foreignKey: 'idQuiz'
  });

  // 4. QUESTION ↔ RÉPONSE (1:N)
  Question.hasMany(Reponse, {
    foreignKey: 'idQuestion',
    onDelete: 'CASCADE'
  });
  Reponse.belongsTo(Question, {
    foreignKey: 'idQuestion'
  });

  // 5. QUESTION ↔ EXPLICATION (1:1)
  Question.hasOne(Explication, {
    foreignKey: 'idQuestion',
    onDelete: 'CASCADE'
  });
  Explication.belongsTo(Question, {
    foreignKey: 'idQuestion'
  });

  // 6. QUIZ ↔ CATÉGORIE (N:N)
  Quiz.belongsToMany(Categorie, {
    through: 'quiz_categories',
    foreignKey: 'idQuiz',
    otherKey: 'idCategorie'
  });
  Categorie.belongsToMany(Quiz, {
    through: 'quiz_categories',
    foreignKey: 'idCategorie',
    otherKey: 'idQuiz'
  });

  // 7. JOUEUR ↔ PARTIE (1:N)
  Joueur.hasMany(Partie, {
    foreignKey: 'idJoueur',
    onDelete: 'CASCADE'
  });
  Partie.belongsTo(Joueur, {
    foreignKey: 'idJoueur'
  });

  // 8. QUIZ ↔ PARTIE (1:N)
  Quiz.hasMany(Partie, {
    foreignKey: 'idQuiz'
  });
  Partie.belongsTo(Quiz, {
    foreignKey: 'idQuiz'
  });

  // 9. MODEJEU ↔ PARTIE (1:N)
  ModeJeu.hasMany(Partie, {
    foreignKey: 'idMode'
  });
  Partie.belongsTo(ModeJeu, {
    foreignKey: 'idMode'
  });

  console.log('✅ Associations définies');
};

// Initialiser les associations
defineAssociations();

// Synchroniser les modèles avec la base de données
const syncDatabase = async (options = {}) => {
  try {
    await sequelize.sync(options);
    console.log('✅ Base de données synchronisée');
  } catch (error) {
    console.error('❌ Erreur de synchronisation:', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  Utilisateur,
  Joueur,
  Partenaire,
  Categorie,
  Quiz,
  Question,
  Reponse,
  Explication,
  ModeJeu,
  Partie,
  syncDatabase
};