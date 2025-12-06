// ============================================
// PASSWORD ROUTES - password.routes.js (CORRIGÉ)
// ============================================

const express = require('express');
const router = express.Router();
const passwordController = require('../controllers/password.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Password
 *   description: Gestion de la réinitialisation et modification de mot de passe
 */

/**
 * @swagger
 * /password/forgot-password:
 *   post:
 *     summary: Demander la réinitialisation de mot de passe
 *     description: Envoie un email avec un lien de réinitialisation
 *     tags: [Password]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email de l'utilisateur
 *                 example: "jean.dupont@example.com"
 *     responses:
 *       200:
 *         description: Email envoyé
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
 *                   example: "Si cet email existe, un lien de réinitialisation a été envoyé"
 *       400:
 *         description: Email manquant ou invalide
 *       500:
 *         description: Erreur serveur
 */
router.post('/forgot-password', passwordController.forgotPassword);

/**
 * @swagger
 * /password/reset-password:
 *   post:
 *     summary: Réinitialiser le mot de passe avec un token
 *     description: Définit un nouveau mot de passe
 *     tags: [Password]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *                 description: Token reçu par email
 *                 example: "abc123def456"
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: "NewPassword123"
 *     responses:
 *       200:
 *         description: Mot de passe réinitialisé
 *       400:
 *         description: Token invalide ou expiré
 *       500:
 *         description: Erreur serveur
 */
router.post('/reset-password', passwordController.resetPassword);

/**
 * @swagger
 * /password/change-password:
 *   post:
 *     summary: Changer son mot de passe
 *     description: Permet à un utilisateur connecté de changer son mot de passe
 *     tags: [Password]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 example: "OldPassword123"
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: "NewPassword123"
 *     responses:
 *       200:
 *         description: Mot de passe changé
 *       400:
 *         description: Mot de passe actuel incorrect
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.post('/change-password', verifyToken, passwordController.changePassword);

/**
 * @swagger
 * /password/verify-token/{token}:
 *   get:
 *     summary: Vérifier la validité d'un token
 *     description: Vérifie si un token de réinitialisation est valide
 *     tags: [Password]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token à vérifier
 *         example: "abc123def456"
 *     responses:
 *       200:
 *         description: Token valide
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
 *                   example: "Token valide"
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: "j***@example.com"
 *       400:
 *         description: Token invalide ou expiré
 *       500:
 *         description: Erreur serveur
 */
router.get('/verify-token/:token', passwordController.verifyResetToken);

module.exports = router;