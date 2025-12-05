const { Joueur, Coin, PointsVie, HistoriqueTransaction, sequelize } = require('../models');

// Helper pour récupérer le joueur
const getJoueur = async (userId) => {
  const joueur = await Joueur.findOne({ where: { idUtilisateur: userId } });
  if (!joueur) throw new Error('Joueur introuvable');
  return joueur;
};

// 1. Obtenir mon Portefeuille (Solde Coins + Vies)
exports.getPortefeuille = async (req, res) => {
  try {
    const joueur = await getJoueur(req.user.id);

    // Récupérer ou créer les soldes s'ils n'existent pas encore
    const [coin] = await Coin.findOrCreate({ 
      where: { idJoueur: joueur.idJoueur },
      defaults: { solde: 0 }
    });
    
    const [vie] = await PointsVie.findOrCreate({ 
      where: { idJoueur: joueur.idJoueur },
      defaults: { solde: 5 }
    });

    res.status(200).json({
      success: true,
      data: {
        coins: coin.solde,
        vies: vie.solde,
        maxVies: 10
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur récupération portefeuille' });
  }
};

// 2. Acheter un item (Simulation d'achat Boutique)
exports.acheterItem = async (req, res) => {
  const t = await sequelize.transaction(); // On utilise une transaction SQL pour la sécurité
  try {
    const { typeItem, montant } = req.body; // ex: typeItem='vie', montant=1 (coût 100 coins)
    const joueur = await getJoueur(req.user.id);
    const coin = await Coin.findOne({ where: { idJoueur: joueur.idJoueur } });
    const vie = await PointsVie.findOne({ where: { idJoueur: joueur.idJoueur } });

    // PRIX (Logique simplifiée, peut être en BDD plus tard)
    const PRIX_VIE = 100; // 1 Vie = 100 Coins

    if (typeItem === 'vie') {
      const coutTotal = montant * PRIX_VIE;

      // Vérifier solde
      if (coin.solde < coutTotal) {
        await t.rollback();
        return res.status(400).json({ success: false, message: 'Solde insuffisant' });
      }

      // Vérifier max vies
      if (vie.solde + montant > 10) {
        await t.rollback();
        return res.status(400).json({ success: false, message: 'Vous avez déjà le maximum de vies' });
      }

      // Exécuter l'échange
      await coin.decrement('solde', { by: coutTotal, transaction: t });
      await vie.increment('solde', { by: montant, transaction: t });

      // Historique Dépense
      await HistoriqueTransaction.create({
        idJoueur: joueur.idJoueur,
        type: 'depense_vie',
        montant: -coutTotal,
        description: `Achat de ${montant} vie(s)`
      }, { transaction: t });

      await t.commit();

      res.status(200).json({ 
        success: true, 
        message: 'Achat effectué !',
        nouveauSolde: { coins: coin.solde - coutTotal, vies: vie.solde + montant }
      });
    } else {
      await t.rollback();
      res.status(400).json({ success: false, message: 'Type d\'item non supporté pour l\'instant' });
    }

  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur lors de l\'achat' });
  }
};

// 3. Historique des transactions
exports.getHistorique = async (req, res) => {
  try {
    const joueur = await getJoueur(req.user.id);
    
    const historique = await HistoriqueTransaction.findAll({
      where: { idJoueur: joueur.idJoueur },
      order: [['dateTransaction', 'DESC']],
      limit: 20
    });

    res.status(200).json({ success: true, data: historique });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur historique' });
  }
};