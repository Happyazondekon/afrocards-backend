const validators = require('../utils/validators');

// Validation pour l'inscription
const validateInscription = (req, res, next) => {
  const { nom, email, motDePasse, pseudo, typeUtilisateur } = req.body;

  // Vérifier les champs requis
  if (!nom || !email || !motDePasse || !typeUtilisateur) {
    return res.status(400).json({
      success: false,
      message: 'Tous les champs requis doivent être remplis',
      required: ['nom', 'email', 'motDePasse', 'typeUtilisateur']
    });
  }

  // Valider l'email
  if (!validators.isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Format d\'email invalide'
    });
  }

  // Valider le mot de passe
  if (!validators.isValidPassword(motDePasse)) {
    return res.status(400).json({
      success: false,
      message: 'Le mot de passe doit contenir au moins 8 caractères, 1 majuscule et 1 chiffre'
    });
  }

  // Valider le pseudo pour les joueurs
  if (typeUtilisateur === 'joueur') {
    if (!pseudo) {
      return res.status(400).json({
        success: false,
        message: 'Le pseudo est requis pour les joueurs'
      });
    }

    if (!validators.isValidPseudo(pseudo)) {
      return res.status(400).json({
        success: false,
        message: 'Le pseudo doit contenir 3-50 caractères alphanumériques ou _'
      });
    }
  }

  // Valider le type d'utilisateur
  const typesValides = ['joueur', 'partenaire', 'admin'];
  if (!typesValides.includes(typeUtilisateur)) {
    return res.status(400).json({
      success: false,
      message: 'Type d\'utilisateur invalide',
      typesValides
    });
  }

  next();
};

// Validation pour la connexion
const validateConnexion = (req, res, next) => {
  const { email, motDePasse } = req.body;

  if (!email || !motDePasse) {
    return res.status(400).json({
      success: false,
      message: 'Email et mot de passe requis'
    });
  }

  if (!validators.isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Format d\'email invalide'
    });
  }

  next();
};

module.exports = {
  validateInscription,
  validateConnexion
};