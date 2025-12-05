const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Message = sequelize.define('Message', {
  idMessage: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idExpediteur: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'joueurs',
      key: 'id_joueur'
    }
  },
  idDestinataire: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'joueurs',
      key: 'id_joueur'
    }
  },
  contenu: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  statut: {
    type: DataTypes.ENUM('envoye', 'lu', 'supprime'),
    defaultValue: 'envoye'
  },
  dateEnvoi: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'messages',
  timestamps: true
});

module.exports = Message;