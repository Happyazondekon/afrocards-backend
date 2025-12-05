const { Joueur, Utilisateur } = require('../models');
const { Op } = require('sequelize');

// 1. Classement Global (Top Joueurs par Score Total)
exports.getGlobalLeaderboard = async (req, res) => {
  try {
    const { limit = 10 } = req.query; // Par défaut top 10

    const classement = await Joueur.findAll({
      attributes: ['idJoueur', 'pseudo', 'avatarURL', 'scoreTotal', 'niveau', 'pays'],
      order: [['scoreTotal', 'DESC']],
      limit: parseInt(limit),
      include: [
        { model: Utilisateur, attributes: ['dateCreation'] } // Optionnel : pour voir l'ancienneté
      ]
    });

    res.status(200).json({
      success: true,
      data: classement
    });
  } catch (error) {
    console.error('Erreur getGlobalLeaderboard:', error);
    res.status(500).json({ success: false, message: 'Erreur récupération classement' });
  }
};

// 2. Classement par Pays
exports.getCountryLeaderboard = async (req, res) => {
  try {
    const { pays } = req.params;
    const { limit = 10 } = req.query;

    const classement = await Joueur.findAll({
      where: { pays: pays },
      attributes: ['idJoueur', 'pseudo', 'avatarURL', 'scoreTotal', 'niveau', 'pays'],
      order: [['scoreTotal', 'DESC']],
      limit: parseInt(limit)
    });

    res.status(200).json({
      success: true,
      pays: pays,
      data: classement
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur récupération classement pays' });
  }
};

// 3. Ma position dans le classement
exports.getMyRank = async (req, res) => {
  try {
    const userId = req.user.id;
    const joueur = await Joueur.findOne({ where: { idUtilisateur: userId } });

    if (!joueur) return res.status(404).json({ message: 'Joueur introuvable' });

    // Compter combien de joueurs ont un score supérieur strictement
    const rank = await Joueur.count({
      where: {
        scoreTotal: {
          [Op.gt]: joueur.scoreTotal
        }
      }
    });

    res.status(200).json({
      success: true,
      data: {
        pseudo: joueur.pseudo,
        score: joueur.scoreTotal,
        rang: rank + 1 // +1 car si 0 personnes sont devant, je suis 1er
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur récupération rang' });
  }
};