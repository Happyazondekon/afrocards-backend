const express = require('express');
const router = express.Router();
const reponseController = require('../controllers/reponse.controller');
const { reponseValidator } = require('../utils/validators');
const { validate } = require('../middlewares/validation.middleware');
const { verifyToken } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   - name: Reponses
 *     description: Gestion des réponses des questions
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Reponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         questionId:
 *           type: integer
 *           example: 5
 *         reponse:
 *           type: string
 *           example: "Porto-Novo"
 *         estBonne:
 *           type: boolean
 *           example: true
 */

/**
 * @swagger
 * /reponses:
 *   post:
 *     summary: Ajouter une réponse à une question
 *     tags: [Reponses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - questionId
 *               - reponse
 *               - estBonne
 *             properties:
 *               questionId:
 *                 type: integer
 *                 example: 5
 *               reponse:
 *                 type: string
 *                 example: "Porto-Novo"
 *               estBonne:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Réponse ajoutée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reponse'
 *       400:
 *         description: Données invalides
 */
router.post('/', reponseValidator, validate, reponseController.createReponse);

/**
 * @swagger
 * /reponses/question/{questionId}:
 *   get:
 *     summary: Récupérer les réponses d'une question
 *     tags: [Reponses]
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la question
 *     responses:
 *       200:
 *         description: Liste des réponses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reponse'
 *       404:
 *         description: Question ou réponses introuvables
 */
router.get('/question/:questionId', reponseController.getReponsesByQuestion);

/**
 * @swagger
 * /reponses/{id}:
 *   put:
 *     summary: Modifier une réponse
 *     tags: [Reponses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la réponse
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reponse:
 *                 type: string
 *                 example: "Nouvelle réponse"
 *               estBonne:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Réponse mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reponse'
 *       404:
 *         description: Réponse non trouvée
 */
router.put('/:id', reponseController.updateReponse);

/**
 * @swagger
 * /reponses/{id}:
 *   delete:
 *     summary: Supprimer une réponse
 *     tags: [Reponses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la réponse
 *     responses:
 *       200:
 *         description: Réponse supprimée
 *       404:
 *         description: Réponse non trouvée
 */
router.delete('/:id', reponseController.deleteReponse);

module.exports = router;
