const { body } = require('express-validator');

// Vos fonctions de validation manuelles existantes (utilisées dans les middlewares sans express-validator)
const validators = {
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isValidPassword: (password) => {
    if (!password || password.length < 8) return false;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return hasUpperCase && hasNumber;
  },

  isValidPseudo: (pseudo) => {
    const pseudoRegex = /^[a-zA-Z0-9_]{3,50}$/;
    return pseudoRegex.test(pseudo);
  },

  isValidAge: (age) => {
    return age >= 13 && age <= 120;
  }
};

// ---------------------------------------------------------
// VALIDATEURS EXPRESS-VALIDATOR (Utilisés avec le middleware validate)
// ---------------------------------------------------------

// 1. Validateur pour les Quiz
const quizValidator = [
  body('titre')
    .notEmpty().withMessage('Le titre du quiz est requis')
    .trim()
    .isLength({ max: 200 }).withMessage('Le titre ne doit pas dépasser 200 caractères'),
  
  body('difficulte')
    .optional()
    .isIn(['facile', 'moyen', 'difficile', 'expert'])
    .withMessage('Difficulté invalide (facile, moyen, difficile, expert)'),

  body('langue')
    .notEmpty().withMessage('La langue est requise (ex: fr, en)')
    .isLength({ min: 2, max: 10 }),

  body('categories')
    .optional()
    .isArray().withMessage('Les catégories doivent être un tableau d\'IDs')
];

// 2. Validateur pour les Questions
const questionValidator = [
  body('idQuiz')
    .notEmpty().withMessage('L\'ID du quiz est requis')
    .isInt().withMessage('L\'ID du quiz doit être un nombre entier'),
  
  body('texte')
    .notEmpty().withMessage('Le texte de la question est requis')
    .trim(),
  
  body('type')
    .optional()
    .isIn(['QCM', 'VraiFaux', 'Completion'])
    .withMessage('Type de question invalide (QCM, VraiFaux, Completion)'),
    
  body('priorite')
    .optional()
    .isInt({ min: 1 }).withMessage('La priorité doit être un entier positif'),

  body('mediaURL')
    .optional()
    .isURL().withMessage('L\'URL du média n\'est pas valide'),

  body('categories')
    .optional()
    .isArray().withMessage('Les catégories doivent être un tableau d\'IDs')
];

// 3. Validateur pour les Réponses
const reponseValidator = [
  body('idQuestion')
    .notEmpty().withMessage('L\'ID de la question est requis')
    .isInt().withMessage('L\'ID de la question doit être un nombre entier'),
  
  body('texte')
    .notEmpty().withMessage('Le texte de la réponse est requis')
    .trim(),
  
  body('estCorrecte')
    .isBoolean().withMessage('Le champ estCorrecte doit être un booléen (true/false)'),

  body('ordreAffichage')
    .optional()
    .isInt().withMessage('L\'ordre d\'affichage doit être un entier')
];

// 4. Validateur pour les Explications
const explicationValidator = [
  body('idQuestion')
    .notEmpty().withMessage('L\'ID de la question est requis')
    .isInt().withMessage('L\'ID de la question doit être un nombre entier'),
  
  body('texte')
    .notEmpty().withMessage('Le texte de l\'explication est requis')
    .trim(),
  
  body('source')
    .optional()
    .trim()
    .isLength({ max: 300 }).withMessage('La source ne doit pas dépasser 300 caractères'),

  body('lienRessource')
    .optional()
    .isURL().withMessage('Le lien ressource doit être une URL valide')
];

// 5. Validateur pour les Catégories
const categorieValidator = [
  body('nom')
    .notEmpty().withMessage('Le nom de la catégorie est requis')
    .trim()
    .isLength({ max: 100 }).withMessage('Le nom ne doit pas dépasser 100 caractères'),
  
  body('description')
    .optional()
    .trim(),

  body('icone')
    .optional()
    .trim()
];

// 6. Validateur pour les Modes de Jeu
const modeJeuValidator = [
  body('nom')
    .notEmpty().withMessage('Le nom du mode de jeu est requis')
    .trim()
    .isLength({ max: 100 }).withMessage('Le nom ne doit pas dépasser 100 caractères'),
  
  body('description')
    .optional()
    .trim(),

  body('regles')
    .optional()
    .isObject().withMessage('Les règles doivent être un objet JSON valide'),

  body('type')
    .optional()
    .isIn(['solo', 'multi', 'tournoi']).withMessage('Type invalide (solo, multi, tournoi)')
];

// 7. Validateurs pour la Partie (Jeu)
const partieValidator = {
  create: [
    body('idQuiz')
      .notEmpty().withMessage('ID du Quiz requis')
      .isInt(),
    body('idMode')
      .notEmpty().withMessage('ID du Mode de jeu requis')
      .isInt()
  ],
  update: [
    body('score')
      .optional()
      .isInt({ min: 0 }).withMessage('Le score doit être positif'),
    body('progression')
      .optional()
      .isInt({ min: 0, max: 100 }).withMessage('La progression doit être entre 0 et 100%'),
    body('tempsTotal')
      .optional()
      .isInt().withMessage('Le temps doit être en secondes'),
    body('statut')
      .optional()
      .isIn(['en_cours', 'termine', 'abandonne'])
  ]
};

// 8. Validateurs pour le Module Admin
const adminValidator = {
  updateStatus: [
    body('statut')
      .notEmpty().withMessage('Le statut est requis')
      .isIn(['actif', 'suspendu', 'supprime'])
      .withMessage('Statut invalide (actif, suspendu, supprime)')
  ],
  updateRole: [
    body('role')
      .notEmpty().withMessage('Le rôle est requis')
      .isIn(['joueur', 'partenaire', 'admin'])
      .withMessage('Rôle invalide (joueur, partenaire, admin)')
  ]
};

// 9. Validateurs pour le Module Partenaire
const partenaireValidator = {
  updateProfile: [
    body('entreprise').notEmpty().withMessage('Nom de l\'entreprise requis'),
    body('secteur').optional().isString()
  ],
  createChallenge: [
    body('titre').notEmpty().withMessage('Titre requis'),
    body('recompense').notEmpty().withMessage('Récompense requise'),
    body('dateDebut').isISO8601().withMessage('Date de début invalide'),
    body('dateFin').isISO8601().withMessage('Date de fin invalide')
  ],
  createPromo: [
    body('description').notEmpty().withMessage('Description requise'),
    body('dateDebut').isISO8601().withMessage('Date invalide'),
    body('dateFin').isISO8601().withMessage('Date invalide')
  ],
  createPub: [
    body('titre').notEmpty().withMessage('Titre requis'),
    body('contenuURL').isURL().withMessage('URL du contenu invalide'),
    body('type').isIn(['banniere', 'video', 'interstitiel']).withMessage('Type invalide'),
    body('cout').isFloat({ min: 0 }).withMessage('Le coût doit être positif')
  ]
};

// 10. Validateurs pour l'Économie
const economieValidator = {
  achat: [
    body('typeItem')
      .notEmpty().withMessage('Type d\'item requis')
      .isIn(['vie', 'coins', 'booster']).withMessage('Type invalide (vie, coins, booster)'),
    body('montant')
      .isInt({ min: 1 }).withMessage('Montant invalide')
  ]
};

// 11. Validateurs pour le Module Social (NOUVEAU)
// socialValidator (dans validators.js) - MODIFIER
const socialValidator = {
  // Validation pour l'envoi de message
  sendMessage: [
    body('idDestinataire')
      .notEmpty().withMessage('L\'ID du destinataire est requis')
      .isInt().withMessage('L\'ID du destinataire doit être un nombre entier'),
    
    body('contenu')
      .notEmpty().withMessage('Le contenu du message est requis')
      .trim()
      .isLength({ min: 1, max: 1000 }).withMessage('Le message doit contenir entre 1 et 1000 caractères')
  ],

  // Validation pour la création de notification
  createNotification: [
    body('type')
      .notEmpty().withMessage('Le type de notification est requis')
      .isIn(['message', 'partie', 'ami', 'recompense', 'systeme', 'promo'])
      .withMessage('Type de notification invalide'),
    
    body('contenu')
      .notEmpty().withMessage('Le contenu de la notification est requis')
      .trim()
      .isLength({ max: 500 }).withMessage('Le contenu ne doit pas dépasser 500 caractères'),
    
    body('canal')
      .optional()
      .isIn(['email', 'push', 'in-app'])
      .withMessage('Canal invalide (email, push, in-app)'),
    
    body('idJoueur')
      .notEmpty().withMessage('L\'ID du joueur est requis')
      .isInt().withMessage('L\'ID du joueur doit être un entier')
  ],

  // CORRIGER CETTE PARTIE : updateNotificationSettings (pas updateParams)
  updateNotificationSettings: [
    body('notifMessage')
      .optional()
      .isBoolean().withMessage('notifMessage doit être un booléen'),
    
    body('notifChallenge')
      .optional()
      .isBoolean().withMessage('notifChallenge doit être un booléen'),
    
    body('notifPromo')
      .optional()
      .isBoolean().withMessage('notifPromo doit être un booléen')
  ],

  // Validation pour marquer un message comme lu
  markAsRead: [
    body('idMessage')
      .optional()
      .isInt().withMessage('L\'ID du message doit être un entier')
  ]
};

// Export global
module.exports = {
  ...validators,        // Exporte les fonctions manuelles directement (isValidEmail...)
  validators,           // Garde l'objet validators pour compatibilité
  quizValidator,
  questionValidator,
  reponseValidator,
  explicationValidator,
  categorieValidator,
  modeJeuValidator,
  partieValidator,
  adminValidator,
  partenaireValidator,
  economieValidator,
  socialValidator       // <-- NOUVEAU : Ajouté à l'export
};