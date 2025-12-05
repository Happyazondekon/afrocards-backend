const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ChallengeSponsorise = sequelize.define('ChallengeSponsorise', {
  idChallenge: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idPartenaire: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'partenaires',
      key: 'id_partenaire'
    }
  },
  titre: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  recompense: {
    type: DataTypes.STRING(200), // Ex: "1000 Coins" ou "Bon d'achat"
    allowNull: false
  },
  dateDebut: {
    type: DataTypes.DATE,
    allowNull: false
  },
  dateFin: {
    type: DataTypes.DATE,
    allowNull: false
  },
  statut: {
    type: DataTypes.ENUM('actif', 'inactif', 'termine'),
    defaultValue: 'actif'
  }
}, {
  tableName: 'challenges_sponsorises',
  timestamps: true
});

module.exports = ChallengeSponsorise;