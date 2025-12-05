const express = require('express');
const router = express.Router();
const classementController = require('../controllers/classement.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   - name: Classement
 *     description: Classements global, par pays et classement personnel
 */

router.use(verifyToken); // Protection globale des routes

/**
 * @swagger
 * /classement/global:
 *   get:
 *     summary: Récupérer le classement global des meilleurs joueurs
 *     tags: [Classement]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Nombre de joueurs à retourner
 *     responses:
 *       200:
 *         description: Classement global retourné
 *       400:
 *         description: Paramètres invalides
 */
router.get('/global', classementController.getGlobalLeaderboard);

/**
 * @swagger
 * /classement/pays/{pays}:
 *   get:
 *     summary: Récupérer le classement des joueurs d'un pays
 *     tags: [Classement]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pays
 *         required: true
 *         schema:
 *           type: string
 *         description: Code ou nom du pays
 *     responses:
 *       200:
 *         description: Classement par pays retourné
 *       404:
 *         description: Aucun joueur trouvé pour ce pays
 */
router.get('/pays/:pays', classementController.getCountryLeaderboard);

/**
 * @swagger
 * /classement/me:
 *   get:
 *     summary: Obtenir ma position dans le classement
 *     tags: [Classement]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Position retournée
 *       404:
 *         description: Joueur introuvable
 */
router.get('/me', classementController.getMyRank);

module.exports = router;
