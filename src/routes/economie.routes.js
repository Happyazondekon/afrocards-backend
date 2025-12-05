const express = require('express');
const router = express.Router();
const economieController = require('../controllers/economie.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { economieValidator } = require('../utils/validators');
const { validate } = require('../middlewares/validation.middleware');

/**
 * @swagger
 * tags:
 *   - name: Economie
 *     description: Gestion des Coins, Vies et Achats
 */

router.use(verifyToken);

/**
 * @swagger
 * /economie/portefeuille:
 *   get:
 *     summary: Voir le solde de Coins et de Vies du joueur
 *     tags: [Economie]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Solde récupéré (coins, vies, maxVies)
 */
router.get('/portefeuille', economieController.getPortefeuille);

/**
 * @swagger
 * /economie/acheter:
 *   post:
 *     summary: Acheter un item (ex: vie) avec des coins
 *     tags: [Economie]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - typeItem
 *               - montant
 *             properties:
 *               typeItem:
 *                 type: string
 *                 enum: [vie, coins, booster]
 *               montant:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Achat effectué
 *       400:
 *         description: Solde insuffisant ou item invalide
 */
router.post(
  '/acheter',
  economieValidator.achat,
  validate,
  economieController.acheterItem
);

/**
 * @swagger
 * /economie/historique:
 *   get:
 *     summary: Voir l'historique des transactions
 *     tags: [Economie]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des transactions récentes
 */
router.get('/historique', economieController.getHistorique);

module.exports = router;
