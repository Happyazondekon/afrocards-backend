const { Partie, Quiz, ModeJeu, Joueur } = require('../models');

// 1. Démarrer une nouvelle partie
exports.startPartie = async (req, res) => {
  try {
    const { idQuiz, idMode } = req.body;
    
    // Récupérer le Joueur associé à l'Utilisateur connecté (via le token)
    const joueur = await Joueur.findOne({ where: { idUtilisateur: req.user.id } });
    
    if (!joueur) {
      return res.status(404).json({ success: false, message: 'Profil joueur introuvable pour cet utilisateur' });
    }

    // Vérifier l'existence du Quiz et du Mode
    const quiz = await Quiz.findByPk(idQuiz);
    const mode = await ModeJeu.findByPk(idMode);

    if (!quiz || !mode) {
      return res.status(404).json({ success: false, message: 'Quiz ou Mode de jeu introuvable' });
    }

    // Création de la partie
    const nouvellePartie = await Partie.create({
      idJoueur: joueur.idJoueur,
      idQuiz,
      idMode,
      score: 0,
      progression: 0,
      statut: 'en_cours',
      dateDebut: new Date(),
      modeJeu: mode.nom // On sauvegarde le nom du mode pour l'historique
    });

    res.status(201).json({
      success: true,
      message: 'Partie démarrée !',
      data: nouvellePartie
    });

  } catch (error) {
    console.error('Erreur startPartie:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
  }
};

// 2. Mettre à jour la progression (à chaque question répondue par exemple)
exports.updateProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { score, progression } = req.body;

    const partie = await Partie.findByPk(id);

    if (!partie) {
      return res.status(404).json({ success: false, message: 'Partie introuvable' });
    }

    if (partie.statut !== 'en_cours') {
      return res.status(400).json({ success: false, message: 'Cette partie est déjà terminée' });
    }

    await partie.update({
      score: score !== undefined ? score : partie.score,
      progression: progression !== undefined ? progression : partie.progression
    });

    res.status(200).json({ success: true, message: 'Progression sauvegardée', data: partie });

  } catch (error) {
    console.error('Erreur updateProgress:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// 3. Terminer la partie (Fin du jeu avec calcul des récompenses)
exports.endPartie = async (req, res) => {
  try {
    const { id } = req.params;
    const { score, tempsTotal } = req.body;

    const partie = await Partie.findByPk(id);
    if (!partie) return res.status(404).json({ success: false, message: 'Partie introuvable' });

    // Vérifier si la partie est déjà terminée pour éviter de donner les récompenses deux fois
    if (partie.statut === 'termine') {
      return res.status(400).json({ success: false, message: 'Partie déjà terminée' });
    }

    // Récupérer le joueur pour mettre à jour ses stats
    const joueur = await Joueur.findByPk(partie.idJoueur);
    if (!joueur) return res.status(404).json({ success: false, message: 'Joueur introuvable' });

    // --- LOGIQUE DE RÉCOMPENSE ---
    // 1 point de score = 10 XP
    const xpGagne = (score || partie.score) * 10;
    // 1 Coin pour 2 points de score (arrondi à l'inférieur)
    // NOTE: Assurez-vous d'avoir ajouté un champ 'coins' ou 'solde' à votre modèle Joueur si vous voulez stocker l'argent
    // Pour l'instant, on suppose que vous gérez cela, sinon on commente la ligne coins
    const coinsGagnes = Math.floor((score || partie.score) / 2);

    // Mise à jour de la partie
    await partie.update({
      score: score !== undefined ? score : partie.score,
      tempsTotal: tempsTotal,
      progression: 100,
      statut: 'termine',
      dateFin: new Date()
    });

    // Mise à jour du Joueur (XP, Niveau, Score Total)
    const nouveauScoreTotal = (joueur.scoreTotal || 0) + (score || partie.score);
    
    // Calcul simple du niveau : 1 niveau tous les 1000 points de score total
    const nouveauNiveau = Math.floor(nouveauScoreTotal / 1000) + 1;
    const aGagneNiveau = nouveauNiveau > joueur.niveau;

    // Mise à jour effective du joueur
    await joueur.update({
      scoreTotal: nouveauScoreTotal,
      niveau: nouveauNiveau,
      // Décommentez la ligne ci-dessous si vous avez ajouté le champ 'coins' au modèle Joueur
      // coins: (joueur.coins || 0) + coinsGagnes 
    });

    res.status(200).json({
      success: true,
      message: 'Partie terminée avec succès',
      data: {
        partie,
        recompenses: {
          xp: xpGagne,
          coins: coinsGagnes,
          levelUp: aGagneNiveau,
          nouveauNiveau: aGagneNiveau ? nouveauNiveau : joueur.niveau
        }
      }
    });

  } catch (error) {
    console.error('Erreur endPartie:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// 4. Obtenir l'historique des parties du joueur connecté
exports.getMyHistory = async (req, res) => {
  try {
    // Retrouver l'ID joueur via le token utilisateur
    const joueur = await Joueur.findOne({ where: { idUtilisateur: req.user.id } });
    
    if (!joueur) return res.status(404).json({ message: 'Joueur non trouvé' });

    const historique = await Partie.findAll({
      where: { idJoueur: joueur.idJoueur },
      include: [
        { 
          model: Quiz, 
          attributes: ['titre', 'difficulte', 'langue'] 
        },
        { 
          model: ModeJeu, 
          attributes: ['nom'] 
        }
      ],
      order: [['dateDebut', 'DESC']]
    });

    res.status(200).json({ success: true, count: historique.length, data: historique });

  } catch (error) {
    console.error('Erreur getMyHistory:', error);
    res.status(500).json({ success: false, message: 'Erreur récupération historique' });
  }
};