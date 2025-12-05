const express = require('express');
const router = express.Router();
const socialController = require('../controllers/social.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { socialValidator } = require('../utils/validators');
const { validate } = require('../middlewares/validation.middleware');

router.use(verifyToken);

// MESSAGERIE
// POST /api/social/messages -> Envoyer un message
router.post('/messages', socialValidator.sendMessage, validate, socialController.sendMessage);

// GET /api/social/messages/:idAutreJoueur -> Voir la conversation
router.get('/messages/:idAutreJoueur', socialController.getConversation);

// NOTIFICATIONS
// GET /api/social/notifications -> Voir mes notifs
router.get('/notifications', socialController.getNotifications);

// PUT /api/social/notifications/:id/read -> Marquer comme lue
router.put('/notifications/:id/read', socialController.markAsRead);

// PUT /api/social/notifications/read-all -> Marquer toutes comme lues (optionnel)
router.put('/notifications/read-all', socialController.markAllAsRead);

// PARAMÈTRES
// PUT /api/social/preferences -> Modifier préférences notifs
router.put('/preferences', socialValidator.updateNotificationSettings, validate, socialController.updatePreferences);

module.exports = router;