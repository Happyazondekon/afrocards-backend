const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validateInscription, validateConnexion } = require('../middlewares/validation.middleware');
const { verifyToken } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Gestion de l'authentification (Inscription, Connexion)
 */

/**
 * @swagger
 * /auth/inscription:
 *   post:
 *     summary: Créer un nouveau compte utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *               - email
 *               - motDePasse
 *               - typeUtilisateur
 *             properties:
 *               nom:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               motDePasse:
 *                 type: string
 *                 format: password
 *                 description: Minimum 8 caractères, 1 majuscule, 1 chiffre
 *               typeUtilisateur:
 *                 type: string
 *                 enum: [joueur, partenaire, admin]
 *               pseudo:
 *                 type: string
 *                 description: Requis si typeUtilisateur est 'joueur'
 *               entreprise:
 *                 type: string
 *                 description: Requis si typeUtilisateur est 'partenaire'
 *     responses:
 *       201:
 *         description: Inscription réussie
 *       400:
 *         description: Erreur de validation ou email déjà existant
 */
router.post('/inscription', validateInscription, authController.inscription);

/**
 * @swagger
 * /auth/connexion:
 *   post:
 *     summary: Se connecter pour obtenir un token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - motDePasse
 *             properties:
 *               email:
 *                 type: string
 *                 default: joueur@test.com
 *               motDePasse:
 *                 type: string
 *                 format: password
 *                 default: Password123
 *     responses:
 *       200:
 *         description: Connexion réussie, retourne le token
 *       401:
 *         description: Identifiants incorrects
 */
router.post('/connexion', validateConnexion, authController.connexion);

/**
 * @swagger
 * /auth/profil:
 *   get:
 *     summary: Récupérer le profil de l'utilisateur connecté
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Détails de l'utilisateur et du profil associé
 *       401:
 *         description: Non authentifié (Token manquant ou invalide)
 */
router.get('/profil', verifyToken, authController.getProfil);

/**
 * @swagger
 * /auth/deconnexion:
 *   post:
 *     summary: Déconnecter l'utilisateur
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 */
router.post('/deconnexion', verifyToken, authController.deconnexion);

module.exports = router;
