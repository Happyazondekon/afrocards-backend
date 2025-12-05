const express = require('express');
const router = express.Router();
const explicationController = require('../controllers/explication.controller');
const { explicationValidator } = require('../utils/validators');
const { validate } = require('../middlewares/validation.middleware');
const { verifyToken } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   - name: Explications
 *     description: Gestion des explications des questions de quiz
 */

router.use(verifyToken); // Toutes les routes nécessitent d'être authentifié

/**
 * @swagger
 * /explications:
 *   post:
 *     summary: Créer une explication pour une question
 *     tags: [Explications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [idQuestion, texte]
 *             properties:
 *               idQuestion:
 *                 type: integer
 *               texte:
 *                 type: string
 *                 description: Texte explicatif
 *     responses:
 *       201:
 *         description: Explication créée avec succès
 *       400:
 *         description: Données invalides
 */
router.post('/', explicationValidator, validate, explicationController.createExplication);

/**
 * @swagger
 * /explications/question/{questionId}:
 *   get:
 *     summary: Récupérer l'explication d'une question
 *     tags: [Explications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la question
 *     responses:
 *       200:
 *         description: Explication trouvée
 *       404:
 *         description: Aucune explication trouvée pour cette question
 */
router.get('/question/:questionId', explicationController.getExplicationByQuestion);

/**
 * @swagger
 * /explications/{id}:
 *   put:
 *     summary: Mettre à jour une explication
 *     tags: [Explications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'explication
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               texte:
 *                 type: string
 *     responses:
 *       200:
 *         description: Explication mise à jour
 *       404:
 *         description: Explication introuvable
 */
router.put('/:id', explicationController.updateExplication);

/**
 * @swagger
 * /explications/{id}:
 *   delete:
 *     summary: Supprimer une explication
 *     tags: [Explications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'explication
 *     responses:
 *       200:
 *         description: Explication supprimée
 *       404:
 *         description: Explication introuvable
 */
router.delete('/:id', explicationController.deleteExplication);

module.exports = router;
