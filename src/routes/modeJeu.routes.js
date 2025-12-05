const express = require('express');
const router = express.Router();
const modeController = require('../controllers/modeJeu.controller');
const { modeJeuValidator } = require('../utils/validators');
const { validate } = require('../middlewares/validation.middleware');

/**
 * @swagger
 * tags:
 *   - name: ModesJeu
 *     description: Gestion des modes de jeu (Solo, Multi, Tournoi)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ModeJeu:
 *       type: object
 *       properties:
 *         idMode:
 *           type: integer
 *           example: 1
 *         nom:
 *           type: string
 *           description: Nom du mode de jeu
 *           example: Mode Classique
 *         type:
 *           type: string
 *           enum: [solo, multi, tournoi]
 *           description: Type du mode de jeu
 *           example: solo
 *         regles:
 *           type: object
 *           description: Règles spécifiques du mode
 *           example: {"temps":60,"vies":3}
 */

/**
 * @swagger
 * /modes:
 *   post:
 *     summary: Créer un nouveau mode de jeu
 *     tags: [ModesJeu]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *               - type
 *             properties:
 *               nom:
 *                 type: string
 *                 example: Mode Classique
 *               type:
 *                 type: string
 *                 enum: [solo, multi, tournoi]
 *                 example: solo
 *               regles:
 *                 type: object
 *                 example: {"temps":60,"vies":3}
 *     responses:
 *       201:
 *         description: Mode de jeu créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ModeJeu'
 *       400:
 *         description: Données invalides
 */
router.post('/', modeJeuValidator, validate, modeController.createMode);

/**
 * @swagger
 * /modes:
 *   get:
 *     summary: Récupérer tous les modes de jeu
 *     tags: [ModesJeu]
 *     responses:
 *       200:
 *         description: Liste des modes de jeu
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ModeJeu'
 */
router.get('/', modeController.getAllModes);

/**
 * @swagger
 * /modes/{id}:
 *   get:
 *     summary: Récupérer un mode de jeu par ID
 *     tags: [ModesJeu]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du mode de jeu
 *     responses:
 *       200:
 *         description: Mode de jeu trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ModeJeu'
 *       404:
 *         description: Mode de jeu non trouvé
 */
router.get('/:id', modeController.getModeById);

/**
 * @swagger
 * /modes/{id}:
 *   put:
 *     summary: Mettre à jour un mode de jeu
 *     tags: [ModesJeu]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du mode de jeu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *                 example: Mode Avancé
 *               type:
 *                 type: string
 *                 enum: [solo, multi, tournoi]
 *                 example: multi
 *               regles:
 *                 type: object
 *                 example: {"temps":90,"vies":5}
 *     responses:
 *       200:
 *         description: Mode de jeu mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ModeJeu'
 *       404:
 *         description: Mode de jeu non trouvé
 */
router.put('/:id', modeJeuValidator, validate, modeController.updateMode);

/**
 * @swagger
 * /modes/{id}:
 *   delete:
 *     summary: Supprimer un mode de jeu
 *     tags: [ModesJeu]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du mode de jeu
 *     responses:
 *       200:
 *         description: Mode de jeu supprimé
 *       404:
 *         description: Mode de jeu non trouvé
 */
router.delete('/:id', modeController.deleteMode);

module.exports = router;
