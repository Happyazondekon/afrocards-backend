const { Trophee, InventaireTrophee, Partie, Badge } = require('../models');
const { Op } = require('sequelize');

/**
 * Vérifie et attribue les trophées débloqués par un joueur
 * @param {Object} joueur - L'instance du joueur
 */
exports.verifierTrophees = async (joueur) => {
  try {
    // 1. Récupérer tous les trophées existants
    const tousLesTrophees = await Trophee.findAll();
    
    // 2. Récupérer les IDs des trophées que le joueur a DÉJÀ
    const tropheesAcquis = await InventaireTrophee.findAll({
      where: { idJoueur: joueur.idJoueur },
      attributes: ['idTrophee']
    });
    const idsTropheesAcquis = tropheesAcquis.map(t => t.idTrophee);

    // 3. Filtrer les trophées potentiels (ceux qu'il n'a pas encore)
    const tropheesPotentiels = tousLesTrophees.filter(t => !idsTropheesAcquis.includes(t.idTrophee));

    const nouveauxTrophees = [];

    // 4. Vérifier les conditions pour chaque trophée potentiel
    for (const trophee of tropheesPotentiels) {
      let conditionRemplie = false;

      // Exemple de conditions basiques pour les trophées
      // Vous pouvez personnaliser selon vos besoins
      switch (trophee.nom.toLowerCase()) {
        case 'première victoire':
          if (joueur.scoreTotal > 0) conditionRemplie = true;
          break;
        
        case 'maître des quiz':
          const nbParties = await Partie.count({ 
            where: { idJoueur: joueur.idJoueur, statut: 'termine' } 
          });
          if (nbParties >= 50) conditionRemplie = true;
          break;

        case 'collectionneur de badges':
          const nbBadges = await InventaireBadge.count({ 
            where: { idJoueur: joueur.idJoueur } 
          });
          if (nbBadges >= 10) conditionRemplie = true;
          break;
          
        // Ajoutez d'autres cas ici
      }

      // 5. Attribuer le trophée si condition remplie
      if (conditionRemplie) {
        await InventaireTrophee.create({
          idJoueur: joueur.idJoueur,
          idTrophee: trophee.idTrophee
        });

        nouveauxTrophees.push(trophee);
      }
    }

    return nouveauxTrophees;

  } catch (error) {
    console.error('Erreur vérification trophées:', error);
    return [];
  }
};