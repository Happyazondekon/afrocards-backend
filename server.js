require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express'); // <-- Import Swagger UI
const { swaggerDocs } = require('./src/config/swagger'); // <-- Import Config
const { syncDatabase } = require('./src/models');

const app = express();
const PORT = process.env.PORT || 5000;

// Synchroniser la DB au démarrage (en dev uniquement)
if (process.env.NODE_ENV === 'development') {
  syncDatabase({ alter: true });
}

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- DOCUMENTATION SWAGGER ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
console.log(`📄 Documentation disponible sur http://localhost:${PORT}/api-docs`);

// Route de test
app.get('/', (req, res) => {
  res.json({ 
    message: 'Bienvenue sur AFROCARDS API 🎮',
    version: '1.0.0',
    status: 'active',
    documentation: '/api-docs'
  });
});

// Import des routes
const routes = require('./src/routes');
app.use('/api', routes);

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'Route non trouvée',
    path: req.path
  });
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error('Erreur:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur serveur interne'
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
  console.log(`📄 Docs: http://localhost:${PORT}/api-docs`);
});

module.exports = app;