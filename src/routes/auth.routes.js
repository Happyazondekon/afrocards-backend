const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validateInscription, validateConnexion } = require('../middlewares/validation.middleware');
const { verifyToken } = require('../middlewares/auth.middleware');

// Routes publiques
router.post('/inscription', validateInscription, authController.inscription);
router.post('/connexion', validateConnexion, authController.connexion);

// Routes protégées (nécessitent authentification)
router.get('/profil', verifyToken, authController.getProfil);
router.post('/deconnexion', verifyToken, authController.deconnexion);

module.exports = router;