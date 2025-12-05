const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Publicite = sequelize.define('Publicite', {
  idPub: {
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
    type: DataTypes.STRING(100),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('banniere', 'video', 'interstitiel'),
    defaultValue: 'banniere'
  },
  contenuURL: {
    type: DataTypes.STRING(500),
    allowNull: false,
    comment: 'URL de l\'image ou de la vidéo'
  },
  lienRedirection: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  cout: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  dateDebut: {
    type: DataTypes.DATE,
    allowNull: false
  },
  dateFin: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'publicites',
  timestamps: true
});

module.exports = Publicite;