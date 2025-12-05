const express = require('express');
const router = express.Router();
const gamificationController = require('../controllers/gamification.controller');
const { verifyToken, checkRole } = require('../middlewares/auth.middleware');

router.use(verifyToken);

/**
 * @swagger
 * tags:
 *   - name: Gamification
 *     description: Gestion des badges, trophées et récompenses du joueur
 */

/**
 * @swagger
 * /gamification/my-rewards:
 *   get:
 *     summary: Récupérer les badges et trophées du joueur connecté
 *     tags: [Gamification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des récompenses (badges + trophées)
 *       401:
 *         description: Non authentifié
 */
router.get('/my-rewards', gamificationController.getMyRewards);

/**
 * @swagger
 * /gamification/badges:
 *   post:
 *     summary: Créer un nouveau badge (ADMIN uniquement)
 *     tags: [Gamification]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nom, description, icone]
 *             properties:
 *               nom:
 *                 type: string
 *               description:
 *                 type: string
 *               icone:
 *                 type: string
 *                 description: URL ou identifiant d’icône
 *     responses:
 *       201:
 *         description: Badge créé avec succès
 *       403:
 *         description: Accès refusé — rôle admin requis
 */
router.post('/badges', checkRole('admin'), gamificationController.createBadge);

module.exports = router;
