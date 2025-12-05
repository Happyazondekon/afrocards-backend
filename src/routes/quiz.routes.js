const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quiz.controller');
const { quizValidator } = require('../utils/validators');
const { validate } = require('../middlewares/validation.middleware');
// Si vous voulez protéger la création par token, décommentez la ligne suivante :
const { verifyToken } = require('../middlewares/auth.middleware');

// Routes
// POST /api/quizzes -> Créer un quiz (Validation + Controller)
router.post('/', quizValidator, validate, quizController.createQuiz);

// GET /api/quizzes -> Liste de tous les quiz
router.get('/', quizController.getAllQuizzes);

// GET /api/quizzes/:id -> Détail d'un quiz
router.get('/:id', quizController.getQuizById);

module.exports = router;