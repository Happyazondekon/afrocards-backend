const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { verifyToken, checkRole } = require('../middlewares/auth.middleware');
const { adminValidator } = require('../utils/validators');
const { validate } = require('../middlewares/validation.middleware');

// PROTECTION GLOBALE : Authentifié ET rôle 'admin' requis pour toutes les routes ci-dessous
router.use(verifyToken);
router.use(checkRole('admin'));

// GET /api/admin/dashboard -> Stats globales
router.get('/dashboard', adminController.getDashboardStats);

// GET /api/admin/users -> Liste des utilisateurs
router.get('/users', adminController.getAllUsers);

// PUT /api/admin/users/:id/status -> Suspendre/Activer un compte
router.put('/users/:id/status', adminValidator.updateStatus, validate, adminController.updateUserStatus);

// PUT /api/admin/users/:id/role -> Changer le rôle (ex: passer admin)
router.put('/users/:id/role', adminValidator.updateRole, validate, adminController.updateUserRole);

module.exports = router;