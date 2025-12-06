// ============================================
// UPLOAD ROUTES - upload.routes.js
// ============================================

const express2 = require('express');
const router2 = express2.Router();
const uploadController = require('../controllers/upload.controller');
const { verifyToken: verifyToken2 } = require('../middlewares/auth.middleware');
const { uploadSingle } = require('../services/upload.service');

router2.use(verifyToken2);

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: Gestion de l'upload de fichiers (images, avatars, médias)
 */

/**
 * @swagger
 * /upload/avatar:
 *   post:
 *     summary: Uploader un avatar de joueur
 *     description: Upload l'avatar sur Cloudinary et met à jour le profil du joueur
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Fichier image (jpg, png, gif, webp - max 5MB)
 *     responses:
 *       200:
 *         description: Avatar uploadé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Avatar mis à jour"
 *                 data:
 *                   type: object
 *                   properties:
 *                     avatarURL:
 *                       type: string
 *                       description: URL Cloudinary de l'avatar
 *                       example: "https://res.cloudinary.com/afrocards/image/upload/v123456/avatar.jpg"
 *       400:
 *         description: Aucun fichier fourni ou format invalide
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
 *                   example: "Aucun fichier fourni"
 *       404:
 *         description: Joueur non trouvé
 *       401:
 *         description: Non authentifié
 *       413:
 *         description: Fichier trop volumineux (max 5MB)
 *       500:
 *         description: Erreur upload avatar
 */
router2.post('/avatar', uploadSingle, uploadController.uploadAvatar);

/**
 * @swagger
 * /upload/question-media:
 *   post:
 *     summary: Uploader un média pour une question (Admin uniquement)
 *     description: Upload une image/vidéo sur Cloudinary pour illustrer une question
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Fichier média (jpg, png, gif, webp - max 5MB)
 *     responses:
 *       200:
 *         description: Média uploadé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Média uploadé avec succès"
 *                 data:
 *                   type: object
 *                   properties:
 *                     mediaURL:
 *                       type: string
 *                       description: URL Cloudinary du média
 *                       example: "https://res.cloudinary.com/afrocards/image/upload/v123456/question_media.jpg"
 *                     publicId:
 *                       type: string
 *                       description: ID public Cloudinary (pour suppression ultérieure)
 *                       example: "afrocards/question_media_abc123"
 *       400:
 *         description: Aucun fichier fourni
 *       401:
 *         description: Non authentifié ou non admin
 *       413:
 *         description: Fichier trop volumineux
 *       500:
 *         description: Erreur upload média
 */
router2.post('/question-media', uploadSingle, uploadController.uploadQuestionMedia);

module.exports = router2;
