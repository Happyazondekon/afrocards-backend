const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { verifyToken, checkRole } = require('../middlewares/auth.middleware');
const { adminValidator } = require('../utils/validators');
const { validate } = require('../middlewares/validation.middleware');

/**
 * @swagger
 * tags:
 *   - name: Admin
 *     description: Gestion administrative des utilisateurs et statistiques
 */

router.use(verifyToken);
router.use(checkRole('admin'));

/**
 * @swagger
 * /admin/dashboard:
 *   get:
 *     summary: Obtenir les statistiques globales de la plateforme
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques du dashboard récupérées
 */
router.get('/dashboard', adminController.getDashboardStats);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Récupérer la liste de tous les utilisateurs
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée
 */
router.get('/users', adminController.getAllUsers);

/**
 * @swagger
 * /admin/users/{id}/status:
 *   put:
 *     summary: Modifier le statut d'un utilisateur (activer / suspendre)
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
 *             properties:
 *               statut:
 *                 type: string
 *                 enum: [actif, suspendu]
 *     responses:
 *       200:
 *         description: Statut mis à jour
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Utilisateur introuvable
 */
router.put(
  '/users/:id/status',
  adminValidator.updateStatus,
  validate,
  adminController.updateUserStatus
);

/**
 * @swagger
 * /admin/users/{id}/role:
 *   put:
 *     summary: Modifier le rôle d'un utilisateur (ex: promouvoir admin)
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
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [joueur, partenaire, admin]
 *     responses:
 *       200:
 *         description: Rôle mis à jour
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Utilisateur introuvable
 */
router.put(
  '/users/:id/role',
  adminValidator.updateRole,
  validate,
  adminController.updateUserRole
);

module.exports = router;
