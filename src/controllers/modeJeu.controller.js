const { ModeJeu } = require('../models');

// 1. Créer un mode de jeu
exports.createMode = async (req, res) => {
  try {
    const { nom, description, regles, type } = req.body;

    // Vérifier l'unicité du nom
    const existingMode = await ModeJeu.findOne({ where: { nom } });
    if (existingMode) {
      return res.status(400).json({ success: false, message: 'Un mode de jeu avec ce nom existe déjà' });
    }

    const newMode = await ModeJeu.create({
      nom,
      description,
      regles, // Sequelize gère la conversion JSON automatiquement
      type: type || 'solo'
    });

    res.status(201).json({
      success: true,
      message: 'Mode de jeu créé avec succès',
      data: newMode
    });
  } catch (error) {
    console.error('Erreur createMode:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
  }
};

// 2. Récupérer tous les modes de jeu
exports.getAllModes = async (req, res) => {
  try {
    const modes = await ModeJeu.findAll();
    res.status(200).json({
      success: true,
      count: modes.length,
      data: modes
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur récupération modes' });
  }
};

// 3. Récupérer un mode par ID
exports.getModeById = async (req, res) => {
  try {
    const { id } = req.params;
    const mode = await ModeJeu.findByPk(id);

    if (!mode) {
      return res.status(404).json({ success: false, message: 'Mode de jeu non trouvé' });
    }

    res.status(200).json({ success: true, data: mode });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// 4. Modifier un mode de jeu
exports.updateMode = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, description, regles, type } = req.body;

    const mode = await ModeJeu.findByPk(id);
    if (!mode) {
      return res.status(404).json({ success: false, message: 'Mode de jeu non trouvé' });
    }

    // Vérification unicité nom si changement
    if (nom && nom !== mode.nom) {
      const existingName = await ModeJeu.findOne({ where: { nom } });
      if (existingName) {
        return res.status(400).json({ success: false, message: 'Ce nom de mode est déjà pris' });
      }
    }

    await mode.update({ nom, description, regles, type });

    res.status(200).json({
      success: true,
      message: 'Mode de jeu mis à jour',
      data: mode
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur modification mode' });
  }
};

// 5. Supprimer un mode de jeu
exports.deleteMode = async (req, res) => {
  try {
    const { id } = req.params;
    const mode = await ModeJeu.findByPk(id);

    if (!mode) {
      return res.status(404).json({ success: false, message: 'Mode de jeu non trouvé' });
    }

    await mode.destroy();

    res.status(200).json({ success: true, message: 'Mode de jeu supprimé' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur suppression mode' });
  }
};