const express = require('express');
const router = express.Router();
const partieController = require('../controllers/partie.controller');
const { partieValidator } = require('../utils/validators');
const { validate } = require('../middlewares/validation.middleware');
const { verifyToken } = require('../middlewares/auth.middleware');

// Toutes les routes nécessitent d'être connecté
router.use(verifyToken);

// POST /api/parties/start -> Lancer une partie
router.post('/start', partieValidator.create, validate, partieController.startPartie);

// PUT /api/parties/:id/progress -> Mettre à jour le score/progression en cours de jeu
router.put('/:id/progress', partieValidator.update, validate, partieController.updateProgress);

// PUT /api/parties/:id/end -> Terminer la partie
router.put('/:id/end', partieValidator.update, validate, partieController.endPartie);

// GET /api/parties/history -> Voir mes anciennes parties
router.get('/history', partieController.getMyHistory);

module.exports = router;