const { Reponse, Question } = require('../models');

// 1. Ajouter une réponse à une question
exports.createReponse = async (req, res) => {
  try {
    const { idQuestion, texte, estCorrecte, ordreAffichage } = req.body;

    // Vérifier si la Question existe
    const question = await Question.findByPk(idQuestion);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question non trouvée' });
    }

    const newReponse = await Reponse.create({
      idQuestion,
      texte,
      estCorrecte: estCorrecte || false,
      ordreAffichage: ordreAffichage || 1
    });

    res.status(201).json({
      success: true,
      message: 'Réponse ajoutée avec succès',
      data: newReponse
    });
  } catch (error) {
    console.error('Erreur createReponse:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
  }
};

// 2. Récupérer toutes les réponses d'une question
exports.getReponsesByQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;

    const reponses = await Reponse.findAll({
      where: { idQuestion: questionId },
      order: [['ordreAffichage', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: reponses.length,
      data: reponses
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur récupération réponses' });
  }
};

// 3. Modifier une réponse
exports.updateReponse = async (req, res) => {
  try {
    const { id } = req.params;
    const { texte, estCorrecte, ordreAffichage } = req.body;

    const reponse = await Reponse.findByPk(id);
    if (!reponse) {
      return res.status(404).json({ success: false, message: 'Réponse non trouvée' });
    }

    await reponse.update({
      texte,
      estCorrecte,
      ordreAffichage
    });

    res.status(200).json({
      success: true,
      message: 'Réponse mise à jour',
      data: reponse
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur modification réponse' });
  }
};

// 4. Supprimer une réponse
exports.deleteReponse = async (req, res) => {
  try {
    const { id } = req.params;
    const reponse = await Reponse.findByPk(id);

    if (!reponse) {
      return res.status(404).json({ success: false, message: 'Réponse non trouvée' });
    }

    await reponse.destroy();

    res.status(200).json({
      success: true,
      message: 'Réponse supprimée avec succès'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur suppression réponse' });
  }
};