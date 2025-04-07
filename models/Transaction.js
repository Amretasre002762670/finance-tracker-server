const { Sequalize, DataTypes } = require('sequelize');
const sequelize = require('./index');
const User = require('./User')

const Transaction = sequelize.define('Transaction', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: User, key: 'id'} },
    amount: { type: DataTypes.FLOAT, allowNull: false },
    type: { type: DataTypes.ENUM('income', 'expense'), allowNull: false },
    description: {type: DataTypes.STRING},
});

module.exports = Transaction;