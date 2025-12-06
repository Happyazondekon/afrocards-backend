const { Quiz, Question, Reponse, Explication, Partie, Joueur, PointsVie } = require('../models');
const { Op } = require('sequelize');

// Démarrer un quiz (récupère les questions mélangées)
exports.startQuizGame = async (req, res) => {
  try {
    const { idQuiz } = req.params;
    
    // Récupérer le joueur
    const joueur = await Joueur.findOne({ where: { idUtilisateur: req.user.id } });
    if (!joueur) return res.status(404).json({ success: false, message: 'Joueur non trouvé' });

    // Vérifier les vies
    const vie = await PointsVie.findOne({ where: { idJoueur: joueur.idJoueur } });
    if (!vie || vie.solde < 1) {
      return res.status(400).json({ 
        success: false, 
        message: 'Pas assez de vies pour jouer' 
      });
    }

    // Décrémenter une vie
    await vie.decrement('solde', { by: 1 });

    // Récupérer le quiz avec ses questions et réponses
    const quiz = await Quiz.findByPk(idQuiz, {
      include: [{
        model: Question,
        include: [{
          model: Reponse,
          attributes: ['idReponse', 'texte'] // NE PAS ENVOYER estCorrecte !
        }]
      }]
    });

    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz non trouvé' });

    // Mélanger les questions
    const questionsShuffled = quiz.Questions.map(q => ({
      idQuestion: q.idQuestion,
      texte: q.texte,
      type: q.type,
      mediaURL: q.mediaURL,
      reponses: shuffleArray(q.Reponses) // Helper pour mélanger
    }));

    // Créer une partie
    const partie = await Partie.create({
      idJoueur: joueur.idJoueur,
      idQuiz: idQuiz,
      idMode: 1, // Mode par défaut (à adapter)
      statut: 'en_cours'
    });

    res.status(200).json({
      success: true,
      data: {
        idPartie: partie.idPartie,
        quiz: {
          titre: quiz.titre,
          difficulte: quiz.difficulte,
          duree: quiz.duree
        },
        questions: questionsShuffled,
        viesRestantes: vie.solde
      }
    });

  } catch (error) {
    console.error('Erreur startQuizGame:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// Valider une réponse
exports.validateAnswer = async (req, res) => {
  try {
    const { idPartie, idQuestion, idReponse } = req.body;

    // Vérifier la partie
    const partie = await Partie.findByPk(idPartie);
    if (!partie || partie.statut !== 'en_cours') {
      return res.status(400).json({ success: false, message: 'Partie invalide' });
    }

    // Récupérer la réponse correcte
    const reponseCorrecte = await Reponse.findOne({
      where: { 
        idQuestion,
        estCorrecte: true 
      }
    });

    const isCorrect = (reponseCorrecte.idReponse === idReponse);

    // Récupérer l'explication
    const explication = await Explication.findOne({
      where: { idQuestion }
    });

    // Mettre à jour le score si correct
    if (isCorrect) {
      await partie.increment('score', { by: 10 }); // +10 points par bonne réponse
    }

    res.status(200).json({
      success: true,
      data: {
        isCorrect,
        reponseCorrecte: {
          id: reponseCorrecte.idReponse,
          texte: reponseCorrecte.texte
        },
        explication: explication ? {
          texte: explication.texte,
          source: explication.source,
          lienRessource: explication.lienRessource
        } : null
      }
    });

  } catch (error) {
    console.error('Erreur validateAnswer:', error);
    res.status(500).json({ success: false, message: 'Erreur validation' });
  }
};

// Helper pour mélanger un tableau
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

module.exports = exports;