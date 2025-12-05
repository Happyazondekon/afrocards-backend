const express = require('express');
const router = express.Router();
const gamificationController = require('../controllers/gamification.controller');
const { verifyToken, checkRole } = require('../middlewares/auth.middleware');

router.use(verifyToken);

// GET /api/gamification/my-rewards -> Mes badges et trophées
router.get('/my-rewards', gamificationController.getMyRewards);

// POST /api/gamification/badges -> Créer un badge (Admin seulement)
router.post('/badges', checkRole('admin'), gamificationController.createBadge);

module.exports = router;