const express = require('express');
const router = express.Router();
const questionController = require('../controllers/question.controller');
const { questionValidator } = require('../utils/validators');
const { validate } = require('../middlewares/validation.middleware');
const { verifyToken } = require('../middlewares/auth.middleware'); // à décommenter si nécessaire

/**
 * @swagger
 * tags:
 *   - name: Questions
 *     description: Gestion des questions pour les quiz
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Question:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         quizId:
 *           type: integer
 *           example: 5
 *         question:
 *           type: string
 *           example: "Quelle est la capitale du Bénin ?"
 *         reponses:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Cotonou", "Porto-Novo", "Parakou", "Abomey"]
 *         bonneReponse:
 *           type: string
 *           example: "Porto-Novo"
 */

/**
 * @swagger
 * /questions:
 *   post:
 *     summary: Créer une question pour un quiz
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quizId
 *               - question
 *               - reponses
 *               - bonneReponse
 *             properties:
 *               quizId:
 *                 type: integer
 *                 example: 5
 *               question:
 *                 type: string
 *                 example: "Quelle est la capitale du Bénin ?"
 *               reponses:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Cotonou", "Porto-Novo", "Parakou", "Abomey"]
 *               bonneReponse:
 *                 type: string
 *                 example: "Porto-Novo"
 *     responses:
 *       201:
 *         description: Question créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 *       400:
 *         description: Données invalides
 */
router.post('/', questionValidator, validate, questionController.createQuestion);

/**
 * @swagger
 * /questions/quiz/{quizId}:
 *   get:
 *     summary: Récupérer toutes les questions d'un quiz
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du quiz
 *     responses:
 *       200:
 *         description: Liste des questions pour le quiz
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Question'
 *       404:
 *         description: Quiz ou questions introuvables
 */
router.get('/quiz/:quizId', questionController.getQuestionsByQuiz);

/**
 * @swagger
 * /questions/{id}:
 *   put:
 *     summary: Modifier une question existante
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la question
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *                 example: "Nouvelle question"
 *               reponses:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["A", "B", "C", "D"]
 *               bonneReponse:
 *                 type: string
 *                 example: "B"
 *     responses:
 *       200:
 *         description: Question mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 *       404:
 *         description: Question non trouvée
 */
router.put('/:id', questionController.updateQuestion);

/**
 * @swagger
 * /questions/{id}:
 *   delete:
 *     summary: Supprimer une question
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la question
 *     responses:
 *       200:
 *         description: Question supprimée avec succès
 *       404:
 *         description: Question non trouvée
 */
router.delete('/:id', questionController.deleteQuestion);

module.exports = router;
