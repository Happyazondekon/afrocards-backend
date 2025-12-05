const express = require('express');
const router = express.Router();
const partenaireController = require('../controllers/partenaire.controller');
const { verifyToken, checkRole } = require('../middlewares/auth.middleware');
const { partenaireValidator } = require('../utils/validators');
const { validate } = require('../middlewares/validation.middleware');

// Protection : Connexion requise + Rôle 'partenaire' (ou 'admin' pour tests)
router.use(verifyToken);
router.use(checkRole('partenaire', 'admin'));

// Profil
router.post('/profil', partenaireValidator.updateProfile, validate, partenaireController.updateProfile);

// Challenges
router.post('/challenges', partenaireValidator.createChallenge, validate, partenaireController.createChallenge);
router.get('/challenges', partenaireController.getMyChallenges);

// Promotions
router.post('/promotions', partenaireValidator.createPromo, validate, partenaireController.createPromotion);

// Publicités
router.post('/publicites', partenaireValidator.createPub, validate, partenaireController.createPublicite);

module.exports = router;