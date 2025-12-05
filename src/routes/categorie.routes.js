const express = require('express');
const router = express.Router();
const categorieController = require('../controllers/categorie.controller');
const { categorieValidator } = require('../utils/validators');
const { validate } = require('../middlewares/validation.middleware');

/**
 * @swagger
 * tags:
 *   - name: Categories
 *     description: Gestion des catégories et organisation des quiz
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Categorie:
 *       type: object
 *       properties:
 *         idCategorie:
 *           type: integer
 *         nom:
 *           type: string
 *         description:
 *           type: string
 *         quiz:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               idQuiz:
 *                 type: integer
 *               titre:
 *                 type: string
 */

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Créer une nouvelle catégorie
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *             properties:
 *               nom:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Catégorie créée avec succès
 *       400:
 *         description: Données invalides
 */
router.post('/', categorieValidator, validate, categorieController.createCategorie);

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Récupérer toutes les catégories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Liste des catégories récupérée
 */
router.get('/', categorieController.getAllCategories);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Récupérer une catégorie spécifique et ses quiz associés
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la catégorie
 *     responses:
 *       200:
 *         description: Catégorie trouvée
 *       404:
 *         description: Catégorie introuvable
 */
router.get('/:id', categorieController.getCategorieById);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Modifier une catégorie
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Catégorie mise à jour
 *       404:
 *         description: Catégorie introuvable
 */
router.put('/:id', categorieValidator, validate, categorieController.updateCategorie);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Supprimer une catégorie
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Catégorie supprimée
 *       404:
 *         description: Catégorie introuvable
 */
router.delete('/:id', categorieController.deleteCategorie);

module.exports = router;
