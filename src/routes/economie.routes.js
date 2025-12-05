const express = require('express');
const router = express.Router();
const economieController = require('../controllers/economie.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { economieValidator } = require('../utils/validators');
const { validate } = require('../middlewares/validation.middleware');

router.use(verifyToken); // Tout nécessite d'être connecté

// GET /api/economie/portefeuille -> Voir mes sous
router.get('/portefeuille', economieController.getPortefeuille);

// POST /api/economie/acheter -> Acheter des vies avec des coins
router.post('/acheter', economieValidator.achat, validate, economieController.acheterItem);

// GET /api/economie/historique -> Voir mes dernières transactions
router.get('/historique', economieController.getHistorique);

module.exports = router;