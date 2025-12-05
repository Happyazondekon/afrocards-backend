const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quiz.controller');
const { quizValidator } = require('../utils/validators');
const { validate } = require('../middlewares/validation.middleware');
// Si vous voulez protéger la création par token, décommentez la ligne suivante :
const { verifyToken } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Quiz:
 *       type: object
 *       properties:
 *         idQuiz:
 *           type: integer
 *         titre:
 *           type: string
 *         description:
 *           type: string
 *         difficulte:
 *           type: string
 *           enum: [facile, moyen, difficile, expert]
 *         langue:
 *           type: string
 *         statut:
 *           type: string
 *           enum: [brouillon, actif]
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *
 * tags:
 *   - name: Quiz
 *     description: Gestion des quiz et du catalogue
 */

/**
 * @swagger
 * /quizzes:
 *   post:
 *     summary: Créer un nouveau quiz
 *     tags: [Quiz]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titre
 *               - langue
 *             properties:
 *               titre:
 *                 type: string
 *               description:
 *                 type: string
 *               difficulte:
 *                 type: string
 *                 enum: [facile, moyen, difficile]
 *               langue:
 *                 type: string
 *                 default: fr
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               categories:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Tableau d'IDs de catégories
 *     responses:
 *       201:
 *         description: Quiz créé avec succès
 *       400:
 *         description: Données invalides
 */
router.post('/', quizValidator, validate, quizController.createQuiz);

/**
 * @swagger
 * /quizzes:
 *   get:
 *     summary: Récupérer la liste de tous les quiz
 *     tags: [Quiz]
 *     responses:
 *       200:
 *         description: Liste des quiz récupérée
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Quiz'
 */
router.get('/', quizController.getAllQuizzes);

/**
 * @swagger
 * /quizzes/{id}:
 *   get:
 *     summary: Récupérer un quiz spécifique par son ID
 *     tags: [Quiz]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du quiz
 *     responses:
 *       200:
 *         description: Détails du quiz
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quiz'
 *       404:
 *         description: Quiz non trouvé
 */
router.get('/:id', quizController.getQuizById);

module.exports = router;
