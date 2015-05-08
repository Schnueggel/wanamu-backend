'use strict';
var sequelize = require('../config').getSequelize();

var Address = module.exports = sequelize.define('Bankdata', {
    id: {
        type: sequelize.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    bankName: {
        type: sequelize.Sequelize.STRING
    },
    owner: {
        type: sequelize.Sequelize.STRING
    },
    iban: {
        type: sequelize.Sequelize.STRING,
        allowNull: false
    },
    bic: {
        type: sequelize.Sequelize.STRING,
        allowNull: false
    }
}, {
    paranoid: true
});

module.exports = Address;
