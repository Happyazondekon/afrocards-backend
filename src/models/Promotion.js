const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Promotion = sequelize.define('Promotion', {
  idPromo: {
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
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  codePromo: {
    type: DataTypes.STRING(50),
    allowNull: true
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
    type: DataTypes.ENUM('actif', 'inactif', 'expire'),
    defaultValue: 'actif'
  }
}, {
  tableName: 'promotions',
  timestamps: true
});

module.exports = Promotion;