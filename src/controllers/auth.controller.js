const authService = require('../services/auth.service');

class AuthController {
  // Inscription
  async inscription(req, res) {
    try {
      const result = await authService.inscription(req.body);

      res.status(201).json({
        success: true,
        message: 'Inscription réussie',
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Connexion
  async connexion(req, res) {
    try {
      const { email, motDePasse } = req.body;
      const result = await authService.connexion(email, motDePasse);

      res.status(200).json({
        success: true,
        message: 'Connexion réussie',
        data: result
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  // Obtenir le profil de l'utilisateur connecté
  async getProfil(req, res) {
    try {
      const { Utilisateur, Joueur, Partenaire } = require('../models');
      
      const utilisateur = await Utilisateur.findByPk(req.user.id, {
        attributes: { exclude: ['motDePasse'] }
      });

      if (!utilisateur) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      // Récupérer le profil spécifique
      let profil = null;
      if (utilisateur.typeUtilisateur === 'joueur') {
        profil = await Joueur.findOne({
          where: { idUtilisateur: utilisateur.idUtilisateur }
        });
      } else if (utilisateur.typeUtilisateur === 'partenaire') {
        profil = await Partenaire.findOne({
          where: { idUtilisateur: utilisateur.idUtilisateur }
        });
      }

      res.status(200).json({
        success: true,
        data: {
          utilisateur,
          profil
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Déconnexion (optionnel - surtout côté client)
  async deconnexion(req, res) {
    try {
      // Mise à jour de la dernière activité
      const { Utilisateur } = require('../models');
      await Utilisateur.update(
        { derniereActivite: new Date() },
        { where: { idUtilisateur: req.user.id } }
      );

      res.status(200).json({
        success: true,
        message: 'Déconnexion réussie'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new AuthController();