// ============================================
// ÉCONOMIE ROUTES - economie.routes.js (CORRECTION FINALE)
// ============================================

const express = require('express');
const router = express.Router();
const economieController = require('../controllers/economie.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { economieValidator } = require('../utils/validators');
const { validate } = require('../middlewares/validation.middleware');

router.use(verifyToken);

/**
 * @swagger
 * tags:
 *   name: Économie
 *   description: Gestion du portefeuille, achats et transactions
 */

/**
 * @swagger
 * /economie/portefeuille:
 *   get:
 *     summary: Obtenir le portefeuille du joueur
 *     description: Retourne le solde de Coins et Points de Vie du joueur connecté
 *     tags: [Économie]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Portefeuille récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     coins:
 *                       type: integer
 *                       description: Solde de coins
 *                       example: 850
 *                     vies:
 *                       type: integer
 *                       description: Points de vie actuels
 *                       example: 3
 *                     maxVies:
 *                       type: integer
 *                       description: Maximum de vies possible
 *                       example: 10
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur récupération portefeuille
 */
router.get('/portefeuille', economieController.getPortefeuille);

/**
 * @swagger
 * /economie/acheter:
 *   post:
 *     summary: Acheter un item avec des coins
 *     description: Permet d'acheter des vies ou d'autres items en dépensant des coins
 *     tags: [Économie]
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
 *                 description: Type d'item à acheter
 *                 example: "vie"
 *               montant:
 *                 type: integer
 *                 minimum: 1
 *                 description: Quantité à acheter
 *                 example: 2
 *     responses:
 *       200:
 *         description: Achat effectué avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Achat effectué !"
 *                 nouveauSolde:
 *                   type: object
 *                   properties:
 *                     coins:
 *                       type: integer
 *                       example: 650
 *                     vies:
 *                       type: integer
 *                       example: 5
 *       400:
 *         description: Solde insuffisant ou maximum de vies atteint
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Solde insuffisant"
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur lors de l'achat
 */
router.post('/acheter', economieValidator.achat, validate, economieController.acheterItem);

/**
 * @swagger
 * /economie/historique:
 *   get:
 *     summary: Obtenir l'historique des transactions
 *     description: Retourne les 20 dernières transactions du joueur
 *     tags: [Économie]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Historique récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       idHistorique:
 *                         type: integer
 *                       type:
 *                         type: string
 *                         enum: [gain_jeu, achat_boutique, bonus_pub, depense_vie, recharge_vie, achat_coins]
 *                         example: "depense_vie"
 *                       montant:
 *                         type: integer
 *                         example: -200
 *                       description:
 *                         type: string
 *                         example: "Achat de 2 vies"
 *                       dateTransaction:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur historique
 */
router.get('/historique', economieController.getHistorique);

module.exports = router;