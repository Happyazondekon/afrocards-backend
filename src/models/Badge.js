const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Badge = sequelize.define('Badge', {
  idBadge: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  icone: {
    type: DataTypes.STRING(500),
    allowNull: true,
    defaultValue: '/badges/default.png'
  },
  rarete: {
    type: DataTypes.ENUM('commun', 'rare', 'epique', 'legendaire'),
    defaultValue: 'commun'
  },
  condition: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Conditions pour obtenir le badge (ex: {"quizCompletes": 10})'
  }
}, {
  tableName: 'badges',
  timestamps: true
});

module.exports = Badge;