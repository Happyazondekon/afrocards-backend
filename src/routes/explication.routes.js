const express = require('express');
const router = express.Router();
const explicationController = require('../controllers/explication.controller');
const { explicationValidator } = require('../utils/validators');
const { validate } = require('../middlewares/validation.middleware');
const { verifyToken } = require('../middlewares/auth.middleware');
// Routes

// POST /api/explications -> Créer une explication
router.post('/', explicationValidator, validate, explicationController.createExplication);

// GET /api/explications/question/:questionId -> Lire l'explication d'une question
router.get('/question/:questionId', explicationController.getExplicationByQuestion);

// PUT /api/explications/:id -> Modifier
router.put('/:id', explicationController.updateExplication);

// DELETE /api/explications/:id -> Supprimer
router.delete('/:id', explicationController.deleteExplication);

module.exports = router;