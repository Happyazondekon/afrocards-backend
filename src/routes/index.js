const express = require('express');
const router = express.Router();

// Import des routes
const authRoutes = require('./auth.routes');
const quizRoutes = require('./quiz.routes');
const questionRoutes = require('./question.routes');
const reponseRoutes = require('./reponse.routes');
const explicationRoutes = require('./explication.routes');
const categorieRoutes = require('./categorie.routes');
const modeJeuRoutes = require('./modeJeu.routes');
const partieRoutes = require('./partie.routes');
const classementRoutes = require('./classement.routes');
const adminRoutes = require('./admin.routes');
const partenaireRoutes = require('./partenaire.routes');
const economieRoutes = require('./economie.routes'); // <-- Ajout Import


// Utiliser les routes
router.use('/auth', authRoutes);
router.use('/quizzes', quizRoutes);
router.use('/questions', questionRoutes);
router.use('/reponses', reponseRoutes);
router.use('/explications', explicationRoutes);
router.use('/categories', categorieRoutes);
router.use('/modes', modeJeuRoutes);
router.use('/parties', partieRoutes);
router.use('/classement', classementRoutes);
router.use('/admin', adminRoutes);
router.use('/partenaires', partenaireRoutes);
router.use('/economie', economieRoutes); // <-- Ajout Route (/api/economie)

// Route de test API
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API AFROCARDS opérationnelle',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;