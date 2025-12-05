const sequelize = require('../config/database');

// ==========================================
// IMPORTS DES MODÈLES
// ==========================================

// 1. Utilisateurs & Acteurs
const Utilisateur = require('./Utilisateur');
const Joueur = require('./Joueur');
const Partenaire = require('./Partenaire');

// 2. Contenu (Quiz)
const Categorie = require('./Categorie');
const Quiz = require('./Quiz');
const Question = require('./Question');
const Reponse = require('./Reponse');
const Explication = require('./Explication');

// 3. Jeu
const ModeJeu = require('./ModeJeu');
const Partie = require('./Partie');

// 4. Marketing (Partenaires)
const ChallengeSponsorise = require('./ChallengeSponsorise');
const Promotion = require('./Promotion');
const Publicite = require('./Publicite');

// 5. Économie & Gamification (Assurez-vous que ces fichiers existent)
const Ressource = require('./Ressource'); // Modèle abstrait/parent si utilisé, sinon retirer
const Coin = require('./Coin');
const PointsVie = require('./PointsVie');
const XP = require('./XP');
const Badge = require('./Badge');
const Trophee = require('./Trophee');
const InventaireBadge = require('./InventaireBadge');
const InventaireTrophee = require('./InventaireTrophee');
const Classement = require('./Classement');
const HistoriqueTransaction = require('./HistoriqueTransaction');

// ==========================================
// DÉFINITION DES ASSOCIATIONS
// ==========================================

const defineAssociations = () => {
  // ========== UTILISATEURS ==========
  
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

  // ========== QUIZ & QUESTIONS ==========

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

  // 10. QUESTION ↔ CATÉGORIE (N:N)
  Question.belongsToMany(Categorie, {
    through: 'question_categories',
    foreignKey: 'idQuestion',
    otherKey: 'idCategorie'
  });
  Categorie.belongsToMany(Question, {
    through: 'question_categories',
    foreignKey: 'idCategorie',
    otherKey: 'idQuestion'
  });

  // ========== PARTIES ==========

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

  // ========== PARTENAIRES & MARKETING ==========

  // 11. PARTENAIRE ↔ CHALLENGE (1:N)
  Partenaire.hasMany(ChallengeSponsorise, {
    foreignKey: 'idPartenaire',
    onDelete: 'CASCADE'
  });
  ChallengeSponsorise.belongsTo(Partenaire, {
    foreignKey: 'idPartenaire'
  });

  // 12. PARTENAIRE ↔ PROMOTION (1:N)
  Partenaire.hasMany(Promotion, {
    foreignKey: 'idPartenaire',
    onDelete: 'CASCADE'
  });
  Promotion.belongsTo(Partenaire, {
    foreignKey: 'idPartenaire'
  });

  // 13. PARTENAIRE ↔ PUBLICITÉ (1:N)
  Partenaire.hasMany(Publicite, {
    foreignKey: 'idPartenaire',
    onDelete: 'CASCADE'
  });
  Publicite.belongsTo(Partenaire, {
    foreignKey: 'idPartenaire'
  });

  // ========== ÉCONOMIE & GAMIFICATION ==========

  // Note : Ces associations supposent que les fichiers modèles (Coin.js, XP.js, etc.) existent.
  
  // 14. JOUEUR ↔ COIN (1:1)
  Joueur.hasOne(Coin, {
    foreignKey: 'idJoueur',
    onDelete: 'CASCADE'
  });
  Coin.belongsTo(Joueur, {
    foreignKey: 'idJoueur'
  });

  // 15. JOUEUR ↔ POINTSVIE (1:1)
  Joueur.hasOne(PointsVie, {
    foreignKey: 'idJoueur',
    onDelete: 'CASCADE'
  });
  PointsVie.belongsTo(Joueur, {
    foreignKey: 'idJoueur'
  });

  // 16. JOUEUR ↔ XP (1:1)
  Joueur.hasOne(XP, {
    foreignKey: 'idJoueur',
    onDelete: 'CASCADE'
  });
  XP.belongsTo(Joueur, {
    foreignKey: 'idJoueur'
  });

  // 17. JOUEUR ↔ BADGE (N:N via InventaireBadge)
  Joueur.belongsToMany(Badge, {
    through: InventaireBadge,
    foreignKey: 'idJoueur',
    otherKey: 'idBadge'
  });
  Badge.belongsToMany(Joueur, {
    through: InventaireBadge,
    foreignKey: 'idBadge',
    otherKey: 'idJoueur'
  });

  // 18. JOUEUR ↔ TROPHÉE (N:N via InventaireTrophée)
  Joueur.belongsToMany(Trophee, {
    through: InventaireTrophee,
    foreignKey: 'idJoueur',
    otherKey: 'idTrophee'
  });
  Trophee.belongsToMany(Joueur, {
    through: InventaireTrophee,
    foreignKey: 'idTrophee',
    otherKey: 'idJoueur'
  });

  // 19. JOUEUR ↔ CLASSEMENT (1:N)
  Joueur.hasMany(Classement, {
    foreignKey: 'idJoueur',
    onDelete: 'CASCADE'
  });
  Classement.belongsTo(Joueur, {
    foreignKey: 'idJoueur'
  });

  // 20. JOUEUR ↔ HISTORIQUE_TRANSACTION (1:N)
  Joueur.hasMany(HistoriqueTransaction, {
    foreignKey: 'idJoueur',
    onDelete: 'CASCADE'
  });
  HistoriqueTransaction.belongsTo(Joueur, {
    foreignKey: 'idJoueur'
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
  syncDatabase,
  // Modèles
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
  ChallengeSponsorise,
  Promotion,
  Publicite,
  Ressource,
  Coin,
  PointsVie,
  XP,
  Badge,
  Trophee,
  InventaireBadge,
  InventaireTrophee,
  Classement,
  HistoriqueTransaction
};