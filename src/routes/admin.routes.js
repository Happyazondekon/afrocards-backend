// ============================================
// ADMIN ROUTES - admin.routes.js (CORRIGÉ)
// ============================================

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { verifyToken, checkRole } = require('../middlewares/auth.middleware');
const { adminValidator } = require('../utils/validators');
const { validate } = require('../middlewares/validation.middleware');

// PROTECTION GLOBALE : Authentifié ET rôle 'admin' requis
router.use(verifyToken);
router.use(checkRole('admin'));

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Administration et gestion des utilisateurs (accès admin uniquement)
 */

/**
 * @swagger
 * /admin/dashboard:
 *   get:
 *     summary: Obtenir les statistiques du dashboard admin
 *     description: Retourne les statistiques globales de la plateforme
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques récupérées avec succès
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
 *                     global:
 *                       type: object
 *                       properties:
 *                         utilisateurs:
 *                           type: integer
 *                           example: 1250
 *                         joueurs:
 *                           type: integer
 *                           example: 1100
 *                         quiz:
 *                           type: integer
 *                           example: 45
 *                         partiesJouees:
 *                           type: integer
 *                           example: 5680
 *                     mensuel:
 *                       type: object
 *                       properties:
 *                         nouveauxInscrits:
 *                           type: integer
 *                           example: 78
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé (non admin)
 *       500:
 *         description: Erreur serveur
 */
router.get('/dashboard', adminController.getDashboardStats);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Obtenir la liste de tous les utilisateurs
 *     description: Liste paginée des utilisateurs avec filtres optionnels
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numéro de la page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Nombre d'éléments par page
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [joueur, partenaire, admin]
 *         description: Filtrer par type d'utilisateur
 *     responses:
 *       200:
 *         description: Liste récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 total:
 *                   type: integer
 *                   example: 1250
 *                 totalPages:
 *                   type: integer
 *                   example: 63
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       idUtilisateur:
 *                         type: integer
 *                       nom:
 *                         type: string
 *                       email:
 *                         type: string
 *                       typeUtilisateur:
 *                         type: string
 *                       statutCompte:
 *                         type: string
 *                       dateCreation:
 *                         type: string
 *                         format: date-time
 *                       Joueur:
 *                         type: object
 *                         nullable: true
 *                         properties:
 *                           pseudo:
 *                             type: string
 *                           niveau:
 *                             type: integer
 *                           pays:
 *                             type: string
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       500:
 *         description: Erreur récupération utilisateurs
 */
router.get('/users', adminController.getAllUsers);

/**
 * @swagger
 * /admin/users/{id}/status:
 *   put:
 *     summary: Modifier le statut d'un compte utilisateur
 *     description: Permet de suspendre, activer ou supprimer un compte
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - statut
 *             properties:
 *               statut:
 *                 type: string
 *                 enum: [actif, suspendu, supprime]
 *                 example: "suspendu"
 *     responses:
 *       200:
 *         description: Statut modifié avec succès
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
 *                   example: "Compte passé en statut : suspendu"
 *       403:
 *         description: Impossible de modifier son propre statut
 *       404:
 *         description: Utilisateur introuvable
 *       500:
 *         description: Erreur modification statut
 */
router.put('/users/:id/status', adminValidator.updateStatus, validate, adminController.updateUserStatus);

/**
 * @swagger
 * /admin/users/{id}/role:
 *   put:
 *     summary: Modifier le rôle d'un utilisateur
 *     description: Permet de promouvoir ou rétrograder un utilisateur
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [joueur, partenaire, admin]
 *                 example: "admin"
 *     responses:
 *       200:
 *         description: Rôle modifié avec succès
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
 *                   example: "Rôle utilisateur mis à jour : admin"
 *       404:
 *         description: Utilisateur introuvable
 *       500:
 *         description: Erreur modification rôle
 */
router.put('/users/:id/role', adminValidator.updateRole, validate, adminController.updateUserRole);

module.exports = router;

// ============================================
// ÉCONOMIE ROUTES - economie.routes.js (CORRIGÉ)
// ============================================

const express2 = require('express');
const router2 = express2.Router();
const economieController = require('../controllers/economie.controller');
const { verifyToken: verifyToken2 } = require('../middlewares/auth.middleware');
const { economieValidator } = require('../utils/validators');
const { validate: validate2 } = require('../middlewares/validation.middleware');

router2.use(verifyToken2);

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
router2.get('/portefeuille', economieController.getPortefeuille);

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
router2.post('/acheter', economieValidator.achat, validate2, economieController.acheterItem);

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
 *                         example: "Achat de 2 vie(s)"
 *                       dateTransaction:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur historique
 */
router2.get('/historique', economieController.getHistorique);

module.exports = router2;