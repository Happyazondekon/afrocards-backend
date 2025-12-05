const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notification = sequelize.define('Notification', {
  idNotif: {
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
    type: DataTypes.STRING(50), // Ex: 'message', 'challenge', 'promo', 'systeme'
    allowNull: false
  },
  titre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  contenu: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  canal: {
    type: DataTypes.ENUM('in-app', 'push', 'email'),
    defaultValue: 'in-app'
  },
  estLue: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  dateCreation: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'notifications',
  timestamps: true
});

module.exports = Notification;