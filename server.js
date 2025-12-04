require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const { syncDatabase } = require('./src/models');

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

// Route de test
app.get('/', (req, res) => {
  res.json({ 
    message: 'Bienvenue sur AFROCARDS API 🎮',
    version: '1.0.0',
    status: 'active'
  });
});

// Import des routes (à venir)
// const routes = require('./src/routes');
// app.use('/api', routes);

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route non trouvée' 
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📍 Environnement: ${process.env.NODE_ENV}`);
  console.log(`db host: ${process.env.DB_HOST}`);
});

module.exports = app;