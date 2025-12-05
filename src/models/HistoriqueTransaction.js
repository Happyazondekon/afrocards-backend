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
    type: DataTypes.ENUM('achat', 'recharge', 'gain', 'depense', 'echange'),
    allowNull: false
  },
  montant: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Montant en Coins'
  },
  ressourceType: {
    type: DataTypes.ENUM('coin', 'pointsVie'),
    defaultValue: 'coin'
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  objetCible: {
    type: DataTypes.STRING(200),
    allowNull: true,
    comment: 'Nom de l\'objet acheté ou action effectuée'
  },
  referenceExterne: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'ID de transaction externe (Stripe, PayPal, etc.)'
  }
}, {
  tableName: 'historique_transactions',
  timestamps: true,
  createdAt: 'date',
  updatedAt: false
});

module.exports = HistoriqueTransaction;