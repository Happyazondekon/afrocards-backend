const express = require('express');
const router = express.Router();
const modeController = require('../controllers/modeJeu.controller');
const { modeJeuValidator } = require('../utils/validators');
const { validate } = require('../middlewares/validation.middleware');

// Routes (CRUD)
router.post('/', modeJeuValidator, validate, modeController.createMode);
router.get('/', modeController.getAllModes);
router.get('/:id', modeController.getModeById);
router.put('/:id', modeJeuValidator, validate, modeController.updateMode);
router.delete('/:id', modeController.deleteMode);

module.exports = router;