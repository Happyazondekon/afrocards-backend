const express = require('express');
const router = express.Router();
const questionController = require('../controllers/question.controller');
const { questionValidator } = require('../utils/validators');
const { validate } = require('../middlewares/validation.middleware');
// Décommentez pour protéger les routes si nécessaire
 const { verifyToken } = require('../middlewares/auth.middleware');

// Routes

// POST /api/questions -> Créer une question (besoin de idQuiz dans le body)
router.post('/', questionValidator, validate, questionController.createQuestion);

// GET /api/questions/quiz/:quizId -> Récupérer toutes les questions d'un quiz
router.get('/quiz/:quizId', questionController.getQuestionsByQuiz);

// PUT /api/questions/:id -> Modifier une question
router.put('/:id', questionController.updateQuestion);

// DELETE /api/questions/:id -> Supprimer une question
router.delete('/:id', questionController.deleteQuestion);

module.exports = router;