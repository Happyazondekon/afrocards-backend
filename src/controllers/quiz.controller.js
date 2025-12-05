const { Quiz, Categorie } = require('../models');

// 1. Créer un nouveau Quiz
exports.createQuiz = async (req, res) => {
  try {
    const { titre, description, difficulte, langue, tags, categories } = req.body;

    // Création du quiz
    const newQuiz = await Quiz.create({
      titre,
      description,
      difficulte,
      langue,
      tags,
      statut: 'brouillon' // Par défaut, un quiz est brouillon à la création
    });

    // Si des IDs de catégories sont fournis, on fait l'association
    if (categories && Array.isArray(categories) && categories.length > 0) {
      await newQuiz.setCategories(categories);
    }

    // On recharge le quiz avec ses catégories pour la réponse
    const quizWithCategories = await Quiz.findByPk(newQuiz.idQuiz, {
      include: [{
        model: Categorie,
        attributes: ['idCategorie', 'nom'],
        through: { attributes: [] }
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Quiz créé avec succès',
      data: quizWithCategories
    });
  } catch (error) {
    console.error('Erreur createQuiz:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la création du quiz',
      error: error.message 
    });
  }
};

// 2. Récupérer tous les Quiz
exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.findAll({
      include: [
        {
          model: Categorie,
          attributes: ['idCategorie', 'nom'],
          through: { attributes: [] }
        }
      ],
      order: [['dateCreation', 'DESC']]
    });
    
    res.status(200).json({ success: true, count: quizzes.length, data: quizzes });
  } catch (error) {
    console.error('Erreur getAllQuizzes:', error);
    res.status(500).json({ success: false, message: 'Erreur récupération quiz' });
  }
};

// 3. Récupérer un Quiz par ID
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id, {
      include: [{
        model: Categorie,
        attributes: ['idCategorie', 'nom', 'icone'],
        through: { attributes: [] }
      }]
    });

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz non trouvé' });
    }

    res.status(200).json({ success: true, data: quiz });
  } catch (error) {
    console.error('Erreur getQuizById:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};