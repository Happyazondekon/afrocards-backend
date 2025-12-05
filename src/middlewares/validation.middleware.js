const { validationResult } = require('express-validator');
const validators = require('../utils/validators');

// NOUVEAU : Middleware générique pour gérer les erreurs d'express-validator
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Erreur de validation',
      errors: errors.array()
    });
  }
  next();
};

// --- Vos middlewares existants (inchangés) ---

const validateInscription = (req, res, next) => {
  const { nom, email, motDePasse, pseudo, typeUtilisateur } = req.body;

  if (!nom || !email || !motDePasse || !typeUtilisateur) {
    return res.status(400).json({
      success: false,
      message: 'Tous les champs requis doivent être remplis',
      required: ['nom', 'email', 'motDePasse', 'typeUtilisateur']
    });
  }

  if (!validators.isValidEmail(email)) {
    return res.status(400).json({ success: false, message: 'Format d\'email invalide' });
  }

  if (!validators.isValidPassword(motDePasse)) {
    return res.status(400).json({ success: false, message: 'Le mot de passe doit contenir au moins 8 caractères, 1 majuscule et 1 chiffre' });
  }

  if (typeUtilisateur === 'joueur') {
    if (!pseudo) return res.status(400).json({ success: false, message: 'Le pseudo est requis pour les joueurs' });
    if (!validators.isValidPseudo(pseudo)) return res.status(400).json({ success: false, message: 'Le pseudo invalide' });
  }

  const typesValides = ['joueur', 'partenaire', 'admin'];
  if (!typesValides.includes(typeUtilisateur)) {
    return res.status(400).json({ success: false, message: 'Type d\'utilisateur invalide' });
  }

  next();
};

const validateConnexion = (req, res, next) => {
  const { email, motDePasse } = req.body;

  if (!email || !motDePasse) {
    return res.status(400).json({ success: false, message: 'Email et mot de passe requis' });
  }

  if (!validators.isValidEmail(email)) {
    return res.status(400).json({ success: false, message: 'Format d\'email invalide' });
  }

  next();
};

module.exports = {
  validate, // <-- Ne pas oublier d'exporter la nouvelle fonction
  validateInscription,
  validateConnexion
};