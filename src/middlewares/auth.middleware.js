const jwt = require('jsonwebtoken');
const { Utilisateur, Joueur, Partenaire } = require('../models');

// Middleware pour vérifier le token JWT
const verifyToken = async (req, res, next) => {
  try {
    // Récupérer le token depuis le header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token manquant ou invalide'
      });
    }

    const token = authHeader.split(' ')[1];

    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Récupérer l'utilisateur
    const utilisateur = await Utilisateur.findByPk(decoded.id);

    if (!utilisateur) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Vérifier si le compte est actif
    if (utilisateur.statutCompte !== 'actif') {
      return res.status(403).json({
        success: false,
        message: 'Compte suspendu ou supprimé'
      });
    }

    // Ajouter les infos utilisateur à la requête
    req.user = {
      id: utilisateur.idUtilisateur,
      email: utilisateur.email,
      type: utilisateur.typeUtilisateur
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expiré'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Token invalide'
    });
  }
};

// Middleware pour vérifier le rôle
const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Non authentifié'
      });
    }

    if (!roles.includes(req.user.type)) {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé'
      });
    }

    next();
  };
};

module.exports = {
  verifyToken,
  checkRole
};