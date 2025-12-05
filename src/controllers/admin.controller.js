const { Utilisateur, Joueur, Quiz, Partie } = require('../models');
const { Op } = require('sequelize');

// 1. Obtenir les statistiques du Dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    // Compter les éléments dans la BDD
    const totalUtilisateurs = await Utilisateur.count();
    const totalJoueurs = await Joueur.count();
    const totalQuiz = await Quiz.count();
    const totalPartiesJouees = await Partie.count({ where: { statut: 'termine' } });

    // Nouveaux inscrits ce mois-ci
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const nouveauxUtilisateurs = await Utilisateur.count({
      where: {
        dateCreation: {
          [Op.gte]: startOfMonth
        }
      }
    });

    res.status(200).json({
      success: true,
      data: {
        global: {
          utilisateurs: totalUtilisateurs,
          joueurs: totalJoueurs,
          quiz: totalQuiz,
          partiesJouees: totalPartiesJouees
        },
        mensuel: {
          nouveauxInscrits: nouveauxUtilisateurs
        }
      }
    });
  } catch (error) {
    console.error('Erreur getDashboardStats:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// 2. Liste de tous les utilisateurs (avec filtre optionnel)
exports.getAllUsers = async (req, res) => {
  try {
    // Pagination simple (optionnelle)
    const { page = 1, limit = 20, type } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (type) {
      whereClause.typeUtilisateur = type;
    }

    const utilisateurs = await Utilisateur.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['motDePasse'] }, // SÉCURITÉ : Ne jamais renvoyer le mot de passe
      include: [
        { model: Joueur, attributes: ['pseudo', 'niveau', 'pays'] }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['dateCreation', 'DESC']]
    });

    res.status(200).json({
      success: true,
      total: utilisateurs.count,
      totalPages: Math.ceil(utilisateurs.count / limit),
      currentPage: parseInt(page),
      data: utilisateurs.rows
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur récupération utilisateurs' });
  }
};

// 3. Modifier le statut d'un compte (Suspendre/Activer)
exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;

    const utilisateur = await Utilisateur.findByPk(id);
    if (!utilisateur) return res.status(404).json({ message: 'Utilisateur introuvable' });

    // Empêcher un admin de se suspendre lui-même (optionnel mais recommandé)
    if (utilisateur.idUtilisateur === req.user.id) {
      return res.status(403).json({ message: 'Vous ne pouvez pas modifier votre propre statut' });
    }

    await utilisateur.update({ statutCompte: statut });

    res.status(200).json({
      success: true,
      message: `Compte passé en statut : ${statut}`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur modification statut' });
  }
};

// 4. Modifier le rôle d'un utilisateur (Promouvoir/Rétrograder)
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const utilisateur = await Utilisateur.findByPk(id);
    if (!utilisateur) return res.status(404).json({ message: 'Utilisateur introuvable' });

    await utilisateur.update({ typeUtilisateur: role });

    res.status(200).json({
      success: true,
      message: `Rôle utilisateur mis à jour : ${role}`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur modification rôle' });
  }
};