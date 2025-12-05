const express = require('express');
const router = express.Router();
const partenaireController = require('../controllers/partenaire.controller');
const { verifyToken, checkRole } = require('../middlewares/auth.middleware');
const { partenaireValidator } = require('../utils/validators');
const { validate } = require('../middlewares/validation.middleware');

/**
 * @swagger
 * tags:
 *   - name: Partenaire
 *     description: Gestion des profils, challenges, promotions et publicités pour les partenaires
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ProfilPartenaire:
 *       type: object
 *       properties:
 *         nom:
 *           type: string
 *           example: "Entreprise X"
 *         email:
 *           type: string
 *           example: "contact@entreprise.com"
 *         description:
 *           type: string
 *           example: "Description de l'entreprise partenaire"
 *     Challenge:
 *       type: object
 *       properties:
 *         titre:
 *           type: string
 *           example: "Défi Mensuel"
 *         description:
 *           type: string
 *           example: "Terminer le challenge pour gagner un bonus"
 *         dateDebut:
 *           type: string
 *           format: date-time
 *           example: "2025-12-01T00:00:00Z"
 *         dateFin:
 *           type: string
 *           format: date-time
 *           example: "2025-12-31T23:59:59Z"
 *     Promotion:
 *       type: object
 *       properties:
 *         titre:
 *           type: string
 *           example: "Promo Noël"
 *         description:
 *           type: string
 *           example: "Réduction de 20% sur tous les produits"
 *         dateDebut:
 *           type: string
 *           format: date-time
 *           example: "2025-12-01T00:00:00Z"
 *         dateFin:
 *           type: string
 *           format: date-time
 *           example: "2025-12-25T23:59:59Z"
 *     Publicite:
 *       type: object
 *       properties:
 *         titre:
 *           type: string
 *           example: "Bannière Promo"
 *         imageUrl:
 *           type: string
 *           example: "https://example.com/pub.jpg"
 *         lien:
 *           type: string
 *           example: "https://example.com"
 */

/**
 * @swagger
 * /partenaire/profil:
 *   post:
 *     summary: Mettre à jour le profil du partenaire
 *     tags: [Partenaire]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProfilPartenaire'
 *     responses:
 *       200:
 *         description: Profil mis à jour avec succès
 *       400:
 *         description: Données invalides
 */
router.post('/profil', partenaireValidator.updateProfile, validate, partenaireController.updateProfile);

/**
 * @swagger
 * /partenaire/challenges:
 *   post:
 *     summary: Créer un challenge
 *     tags: [Partenaire]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Challenge'
 *     responses:
 *       201:
 *         description: Challenge créé avec succès
 *       400:
 *         description: Données invalides
 *   get:
 *     summary: Récupérer les challenges du partenaire
 *     tags: [Partenaire]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des challenges
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Challenge'
 */
router.post('/challenges', partenaireValidator.createChallenge, validate, partenaireController.createChallenge);
router.get('/challenges', partenaireController.getMyChallenges);

/**
 * @swagger
 * /partenaire/promotions:
 *   post:
 *     summary: Créer une promotion
 *     tags: [Partenaire]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Promotion'
 *     responses:
 *       201:
 *         description: Promotion créée avec succès
 *       400:
 *         description: Données invalides
 */
router.post('/promotions', partenaireValidator.createPromo, validate, partenaireController.createPromotion);

/**
 * @swagger
 * /partenaire/publicites:
 *   post:
 *     summary: Créer une publicité
 *     tags: [Partenaire]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Publicite'
 *     responses:
 *       201:
 *         description: Publicité créée avec succès
 *       400:
 *         description: Données invalides
 */
router.post('/publicites', partenaireValidator.createPub, validate, partenaireController.createPublicite);

module.exports = router;
