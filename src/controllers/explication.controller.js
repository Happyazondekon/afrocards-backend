const { Explication, Question } = require('../models');

// 1. Ajouter une explication à une question
exports.createExplication = async (req, res) => {
  try {
    const { idQuestion, texte, source, lienRessource } = req.body;

    // Vérifier si la Question existe
    const question = await Question.findByPk(idQuestion);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question non trouvée' });
    }

    // Vérifier si une explication existe DÉJÀ pour cette question (Relation 1:1)
    const existingExplication = await Explication.findOne({ where: { idQuestion } });
    if (existingExplication) {
      return res.status(400).json({ 
        success: false, 
        message: 'Une explication existe déjà pour cette question. Utilisez la modification.' 
      });
    }

    const newExplication = await Explication.create({
      idQuestion,
      texte,
      source,
      lienRessource
    });

    res.status(201).json({
      success: true,
      message: 'Explication ajoutée avec succès',
      data: newExplication
    });
  } catch (error) {
    console.error('Erreur createExplication:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
  }
};

// 2. Récupérer l'explication d'une question
exports.getExplicationByQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;

    const explication = await Explication.findOne({
      where: { idQuestion: questionId }
    });

    if (!explication) {
      return res.status(404).json({ success: false, message: 'Aucune explication trouvée pour cette question' });
    }

    res.status(200).json({
      success: true,
      data: explication
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur récupération explication' });
  }
};

// 3. Modifier une explication
exports.updateExplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { texte, source, lienRessource } = req.body;

    const explication = await Explication.findByPk(id);
    if (!explication) {
      return res.status(404).json({ success: false, message: 'Explication non trouvée' });
    }

    await explication.update({
      texte,
      source,
      lienRessource
    });

    res.status(200).json({
      success: true,
      message: 'Explication mise à jour',
      data: explication
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur modification explication' });
  }
};

// 4. Supprimer une explication
exports.deleteExplication = async (req, res) => {
  try {
    const { id } = req.params;
    const explication = await Explication.findByPk(id);

    if (!explication) {
      return res.status(404).json({ success: false, message: 'Explication non trouvée' });
    }

    await explication.destroy();

    res.status(200).json({
      success: true,
      message: 'Explication supprimée avec succès'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur suppression explication' });
  }
};