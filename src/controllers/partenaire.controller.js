const { Partenaire, ChallengeSponsorise, Promotion, Publicite, Utilisateur } = require('../models');

// Helper pour récupérer l'ID partenaire depuis le user connecté
const getPartenaireId = async (userId) => {
  const partenaire = await Partenaire.findOne({ where: { idUtilisateur: userId } });
  if (!partenaire) throw new Error('Profil partenaire non trouvé');
  return partenaire;
};

// 1. Créer ou Mettre à jour le profil partenaire
exports.updateProfile = async (req, res) => {
  try {
    const { entreprise, secteur } = req.body;
    const userId = req.user.id;

    let partenaire = await Partenaire.findOne({ where: { idUtilisateur: userId } });

    if (partenaire) {
      await partenaire.update({ entreprise, secteur });
    } else {
      partenaire = await Partenaire.create({
        idUtilisateur: userId,
        entreprise,
        secteur,
        statut: 'en_attente'
      });
    }

    res.status(200).json({ success: true, data: partenaire });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur profil partenaire' });
  }
};

// 2. Créer un Challenge Sponsorisé
exports.createChallenge = async (req, res) => {
  try {
    const partenaire = await getPartenaireId(req.user.id);
    const { titre, description, recompense, dateDebut, dateFin } = req.body;

    const challenge = await ChallengeSponsorise.create({
      idPartenaire: partenaire.idPartenaire,
      titre,
      description,
      recompense,
      dateDebut,
      dateFin
    });

    res.status(201).json({ success: true, message: 'Challenge créé', data: challenge });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Erreur création challenge' });
  }
};

// 3. Mes Challenges
exports.getMyChallenges = async (req, res) => {
  try {
    const partenaire = await getPartenaireId(req.user.id);
    const challenges = await ChallengeSponsorise.findAll({ where: { idPartenaire: partenaire.idPartenaire } });
    res.status(200).json({ success: true, data: challenges });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur récupération challenges' });
  }
};

// 4. Créer une Promotion
exports.createPromotion = async (req, res) => {
  try {
    const partenaire = await getPartenaireId(req.user.id);
    const { description, codePromo, dateDebut, dateFin } = req.body;

    const promo = await Promotion.create({
      idPartenaire: partenaire.idPartenaire,
      description,
      codePromo,
      dateDebut,
      dateFin
    });

    res.status(201).json({ success: true, message: 'Promotion créée', data: promo });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur création promotion' });
  }
};

// 5. Créer une Publicité
exports.createPublicite = async (req, res) => {
  try {
    const partenaire = await getPartenaireId(req.user.id);
    const { titre, type, contenuURL, lienRedirection, cout, dateDebut, dateFin } = req.body;

    const pub = await Publicite.create({
      idPartenaire: partenaire.idPartenaire,
      titre,
      type,
      contenuURL,
      lienRedirection,
      cout,
      dateDebut,
      dateFin
    });

    res.status(201).json({ success: true, message: 'Publicité créée', data: pub });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur création publicité' });
  }
};