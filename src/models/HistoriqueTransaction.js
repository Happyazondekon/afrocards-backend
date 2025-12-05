const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HistoriqueTransaction = sequelize.define('HistoriqueTransaction', {
  idHistorique: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idJoueur: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'joueurs',
      key: 'id_joueur'
    }
  },
  type: {
    type: DataTypes.ENUM('gain_jeu', 'achat_boutique', 'bonus_pub', 'depense_vie', 'recharge_vie', 'achat_coins'),
    allowNull: false
  },
  montant: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Positif pour gain, négatif pour dépense'
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  dateTransaction: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'historique_transactions',
  timestamps: true
});

module.exports = HistoriqueTransaction;