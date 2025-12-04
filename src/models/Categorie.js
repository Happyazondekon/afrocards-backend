const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Categorie = sequelize.define('Categorie', {
  idCategorie: {
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
    defaultValue: '/icons/category-default.png'
  }
}, {
  tableName: 'categories',
  timestamps: true
});

module.exports = Categorie;