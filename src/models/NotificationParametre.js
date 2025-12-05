const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const NotificationParametre = sequelize.define('NotificationParametre', {
  idParam: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idJoueur: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'joueurs',
      key: 'id_joueur'
    }
  },
  notifMessage: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Recevoir notif pour les messages privés'
  },
  notifChallenge: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Recevoir notif pour les challenges'
  },
  notifPromo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Recevoir notif pour les promotions'
  }
}, {
  tableName: 'notification_parametres',
  timestamps: false
});

module.exports = NotificationParametre;