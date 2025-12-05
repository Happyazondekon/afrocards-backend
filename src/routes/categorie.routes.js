const express = require('express');
const router = express.Router();
const categorieController = require('../controllers/categorie.controller');
const { categorieValidator } = require('../utils/validators');
const { validate } = require('../middlewares/validation.middleware');

// Routes

// POST /api/categories -> Créer une catégorie
router.post('/', categorieValidator, validate, categorieController.createCategorie);

// GET /api/categories -> Liste de toutes les catégories
router.get('/', categorieController.getAllCategories);

// GET /api/categories/:id -> Détail d'une catégorie (et ses quiz)
router.get('/:id', categorieController.getCategorieById);

// PUT /api/categories/:id -> Modifier
router.put('/:id', categorieValidator, validate, categorieController.updateCategorie);

// DELETE /api/categories/:id -> Supprimer
router.delete('/:id', categorieController.deleteCategorie);

module.exports = router;