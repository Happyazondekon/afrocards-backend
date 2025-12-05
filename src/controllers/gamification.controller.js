const { Joueur, Badge, Trophee } = require('../models');

// Récupérer mon inventaire de récompenses
exports.getMyRewards = async (req, res) => {
  try {
    const joueur = await Joueur.findOne({ 
      where: { idUtilisateur: req.user.id },
      include: [
        { model: Badge, as: 'badges', through: { attributes: ['dateObtention'] } },
        { model: Trophee, as: 'trophees', through: { attributes: ['dateObtention'] } }
      ]
    });

    if (!joueur) return res.status(404).json({ message: 'Joueur non trouvé' });

    res.status(200).json({
      success: true,
      data: {
        badges: joueur.badges,
        trophees: joueur.trophees
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur récupération récompenses' });
  }
};

// Route Admin : Créer un Badge (Pour remplir la BDD)
exports.createBadge = async (req, res) => {
  try {
    const badge = await Badge.create(req.body);
    res.status(201).json({ success: true, data: badge });
  } catch (error) {
    res.status(500).json({ message: 'Erreur création badge' });
  }
};