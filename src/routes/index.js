const express = require('express');
const router = express.Router();

// Import des routes
const authRoutes = require('./auth.routes');

// Utiliser les routes
router.use('/auth', authRoutes);

// Route de test API
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API AFROCARDS opérationnelle',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;