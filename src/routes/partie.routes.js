const express = require('express');
const router = express.Router();
const partieController = require('../controllers/partie.controller');
const { partieValidator } = require('../utils/validators');
const { validate } = require('../middlewares/validation.middleware');
const { verifyToken } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   - name: Parties
 *     description: Gestion du cycle de vie du jeu (Start, Progress, End)
 */

router.use(verifyToken);

/**
 * @swagger
 * /parties/start:
 *   post:
 *     summary: Démarrer une nouvelle partie
 *     tags: [Parties]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idQuiz
 *               - idMode
 *             properties:
 *               idQuiz:
 *                 type: integer
 *               idMode:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Partie démarrée
 *       404:
 *         description: Quiz ou Mode introuvable
 */
router.post(
  '/start',
  partieValidator.create,
  validate,
  partieController.startPartie
);

/**
 * @swagger
 * /parties/{id}/progress:
 *   put:
 *     summary: Mettre à jour la progression d'une partie en cours
 *     tags: [Parties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la partie
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               score:
 *                 type: integer
 *               progression:
 *                 type: integer
 *                 description: Pourcentage (0-100)
 *     responses:
 *       200:
 *         description: Progression sauvegardée
 */
router.put(
  '/:id/progress',
  partieValidator.update,
  validate,
  partieController.updateProgress
);

/**
 * @swagger
 * /parties/{id}/end:
 *   put:
 *     summary: Terminer une partie et calculer les récompenses
 *     tags: [Parties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - score
 *             properties:
 *               score:
 *                 type: integer
 *               tempsTotal:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Partie terminée — récompenses retournées
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     recompenses:
 *                       type: object
 */
router.put(
  '/:id/end',
  partieValidator.update,
  validate,
  partieController.endPartie
);

/**
 * @swagger
 * /parties/history:
 *   get:
 *     summary: Obtenir l'historique des parties du joueur connecté
 *     tags: [Parties]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des anciennes parties
 */
router.get('/history', partieController.getMyHistory);

module.exports = router;
