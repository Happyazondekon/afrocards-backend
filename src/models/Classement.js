const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Classement = sequelize.define('Classement', {
  idClassement: {
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
    type: DataTypes.ENUM('global', 'hebdo', 'mensuel'),
    defaultValue: 'global'
  },
  rang: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  score: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  periode: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Format: YYYY-MM ou YYYY-Wxx'
  },
  filtre: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Pays, niveau, ou autre filtre'
  },
  dateMaj: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'classements',
  timestamps: true,
  updatedAt: 'dateMaj'
});

module.exports = Classement;