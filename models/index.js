const Sequelize = require('sequelize');

const sequelize = new Sequelize('financial_tracker', 'test', 'root', { 
    host: 'localhost',
    dialect: 'postgres',
});

module.exports = sequelize;