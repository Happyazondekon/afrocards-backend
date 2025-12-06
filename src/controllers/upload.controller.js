exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Aucun fichier fourni' });
    }

    const { Joueur } = require('../models');
    const joueur = await Joueur.findOne({ where: { idUtilisateur: req.user.id } });
    
    if (!joueur) {
      return res.status(404).json({ success: false, message: 'Joueur non trouvé' });
    }

    // Mise à jour de l'URL avatar
    await joueur.update({ avatarURL: req.file.path });

    res.status(200).json({
      success: true,
      message: 'Avatar mis à jour',
      data: {
        avatarURL: req.file.path
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur upload avatar' });
  }
};

exports.uploadQuestionMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Aucun fichier fourni' });
    }

    res.status(200).json({
      success: true,
      message: 'Média uploadé avec succès',
      data: {
        mediaURL: req.file.path,
        publicId: req.file.filename
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur upload média' });
  }
};