// ============================================
// GAMEPLAY ROUTES - gameplay.routes.js
// ============================================

const express = require('express');
const router = express.Router();
const gameplayController = require('../controllers/gameplay.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.use(verifyToken);

/**
 * @swagger
 * tags:
 *   name: Gameplay
 *   description: Gestion du jeu en temps réel (démarrage quiz, validation réponses)
 */

/**
 * @swagger
 * /gameplay/quiz/{idQuiz}/start:
 *   get:
 *     summary: Démarrer une partie de quiz
 *     description: Récupère les questions mélangées et débite une vie du joueur
 *     tags: [Gameplay]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idQuiz
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du quiz à jouer
 *         example: 1
 *     responses:
 *       200:
 *         description: Partie démarrée avec succès
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
 *                     idPartie:
 *                       type: integer
 *                       description: ID de la partie créée
 *                       example: 42
 *                     quiz:
 *                       type: object
 *                       properties:
 *                         titre:
 *                           type: string
 *                           example: "Culture Générale Africaine"
 *                         difficulte:
 *                           type: string
 *                           enum: [facile, moyen, difficile, expert]
 *                           example: "moyen"
 *                         duree:
 *                           type: integer
 *                           description: Durée en secondes
 *                           example: 300
 *                     questions:
 *                       type: array
 *                       description: Questions mélangées avec réponses mélangées (sans indicateur de réponse correcte)
 *                       items:
 *                         type: object
 *                         properties:
 *                           idQuestion:
 *                             type: integer
 *                             example: 15
 *                           texte:
 *                             type: string
 *                             example: "Quelle est la capitale du Bénin ?"
 *                           type:
 *                             type: string
 *                             enum: [QCM, VraiFaux, Completion]
 *                             example: "QCM"
 *                           mediaURL:
 *                             type: string
 *                             nullable: true
 *                             example: "https://cloudinary.com/image.jpg"
 *                           reponses:
 *                             type: array
 *                             description: Réponses mélangées (NE CONTIENT PAS le champ estCorrecte)
 *                             items:
 *                               type: object
 *                               properties:
 *                                 idReponse:
 *                                   type: integer
 *                                   example: 58
 *                                 texte:
 *                                   type: string
 *                                   example: "Porto-Novo"
 *                     viesRestantes:
 *                       type: integer
 *                       description: Nombre de vies restantes après débit
 *                       example: 4
 *       400:
 *         description: Pas assez de vies
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
 *                   example: "Pas assez de vies pour jouer"
 *       404:
 *         description: Quiz ou joueur non trouvé
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
 *                   example: "Quiz non trouvé"
 *       401:
 *         description: Non authentifié
 */
router.get('/quiz/:idQuiz/start', gameplayController.startQuizGame);

/**
 * @swagger
 * /gameplay/validate-answer:
 *   post:
 *     summary: Valider la réponse d'un joueur à une question
 *     description: Vérifie si la réponse est correcte et retourne l'explication
 *     tags: [Gameplay]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idPartie
 *               - idQuestion
 *               - idReponse
 *             properties:
 *               idPartie:
 *                 type: integer
 *                 description: ID de la partie en cours
 *                 example: 42
 *               idQuestion:
 *                 type: integer
 *                 description: ID de la question
 *                 example: 15
 *               idReponse:
 *                 type: integer
 *                 description: ID de la réponse choisie par le joueur
 *                 example: 58
 *     responses:
 *       200:
 *         description: Réponse validée avec succès
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
 *                     isCorrect:
 *                       type: boolean
 *                       description: La réponse du joueur est-elle correcte ?
 *                       example: true
 *                     reponseCorrecte:
 *                       type: object
 *                       description: La réponse correcte (affichée dans tous les cas)
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 58
 *                         texte:
 *                           type: string
 *                           example: "Porto-Novo"
 *                     explication:
 *                       type: object
 *                       nullable: true
 *                       description: Explication pédagogique (si disponible)
 *                       properties:
 *                         texte:
 *                           type: string
 *                           example: "Porto-Novo est la capitale officielle du Bénin depuis 1900, bien que Cotonou soit la plus grande ville."
 *                         source:
 *                           type: string
 *                           nullable: true
 *                           example: "Wikipédia"
 *                         lienRessource:
 *                           type: string
 *                           nullable: true
 *                           example: "https://fr.wikipedia.org/wiki/Porto-Novo"
 *       400:
 *         description: Partie invalide ou terminée
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
 *                   example: "Partie invalide"
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.post('/validate-answer', gameplayController.validateAnswer);

module.exports = router;
