const express = require('express');
const router = express.Router();
const classementController = require('../controllers/classement.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// Routes publiques (ou protégées selon votre choix, ici protégées pour l'exemple)
router.use(verifyToken);

// GET /api/classement/global?limit=20 -> Top joueurs
router.get('/global', classementController.getGlobalLeaderboard);

// GET /api/classement/pays/:pays -> Top joueurs d'un pays
router.get('/pays/:pays', classementController.getCountryLeaderboard);

// GET /api/classement/me -> Ma position
router.get('/me', classementController.getMyRank);

module.exports = router;