const { Question, Quiz, Categorie } = require('../models');

// 1. Créer une question dans un Quiz
exports.createQuestion = async (req, res) => {
  try {
    const { idQuiz, texte, type, priorite, mediaURL, categories } = req.body;

    // Vérifier si le Quiz existe
    const quiz = await Quiz.findByPk(idQuiz);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz non trouvé' });
    }

    // Création de la question
    const newQuestion = await Question.create({
      idQuiz,
      texte,
      type: type || 'QCM',
      priorite: priorite || 1,
      mediaURL
    });

    // Gestion de l'association N:N avec les catégories
    if (categories && Array.isArray(categories) && categories.length > 0) {
      await newQuestion.setCategories(categories);
    }

    res.status(201).json({
      success: true,
      message: 'Question ajoutée avec succès',
      data: newQuestion
    });
  } catch (error) {
    console.error('Erreur createQuestion:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
  }
};

// 2. Récupérer toutes les questions d'un Quiz spécifique
exports.getQuestionsByQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;

    // Vérifier si le Quiz existe
    const quiz = await Quiz.findByPk(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz non trouvé' });
    }

    const questions = await Question.findAll({
      where: { idQuiz: quizId },
      include: [
        {
          model: Categorie,
          attributes: ['idCategorie', 'nom'],
          through: { attributes: [] } // Masquer la table de liaison 'question_categories'
        }
      ],
      order: [['priorite', 'ASC']] // Trié par priorité
    });

    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions
    });
  } catch (error) {
    console.error('Erreur getQuestionsByQuiz:', error);
    res.status(500).json({ success: false, message: 'Erreur récupération questions' });
  }
};

// 3. Modifier une question
exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { texte, type, priorite, mediaURL, categories } = req.body;

    const question = await Question.findByPk(id);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question non trouvée' });
    }

    // Mise à jour des champs de base
    await question.update({
      texte,
      type,
      priorite,
      mediaURL
    });

    // Mise à jour des catégories (remplace les anciennes associations)
    if (categories && Array.isArray(categories)) {
      await question.setCategories(categories);
    }

    res.status(200).json({
      success: true,
      message: 'Question mise à jour',
      data: question
    });
  } catch (error) {
    console.error('Erreur updateQuestion:', error);
    res.status(500).json({ success: false, message: 'Erreur modification question' });
  }
};

// 4. Supprimer une question
exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findByPk(id);

    if (!question) {
      return res.status(404).json({ success: false, message: 'Question non trouvée' });
    }

    await question.destroy();

    res.status(200).json({
      success: true,
      message: 'Question supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur deleteQuestion:', error);
    res.status(500).json({ success: false, message: 'Erreur suppression question' });
  }
};