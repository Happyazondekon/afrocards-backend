const express = require('express');
const router = express.Router();
const reponseController = require('../controllers/reponse.controller');
const { reponseValidator } = require('../utils/validators');
const { validate } = require('../middlewares/validation.middleware');
const { verifyToken } = require('../middlewares/auth.middleware');

// Routes

// POST /api/reponses -> Ajouter une réponse
router.post('/', reponseValidator, validate, reponseController.createReponse);

// GET /api/reponses/question/:questionId -> Voir les réponses d'une question
router.get('/question/:questionId', reponseController.getReponsesByQuestion);

// PUT /api/reponses/:id -> Modifier
router.put('/:id', reponseController.updateReponse);

// DELETE /api/reponses/:id -> Supprimer
router.delete('/:id', reponseController.deleteReponse);

module.exports = router;