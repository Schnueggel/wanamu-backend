'use strict';
var sequelize = require('../config').getSequelize(),
    Country = require('./lookup/country.js');

var Address = module.exports = sequelize.define('Address', {
    id: {
        type: sequelize.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    street: {
        type: sequelize.Sequelize.STRING(50)
    },
    addition1: {
        type: sequelize.Sequelize.STRING
    },
    addition2: {
        type: sequelize.Sequelize.STRING
    },
    zipCode: {
        type: sequelize.Sequelize.STRING(10)
    },
    city: {
        type: sequelize.Sequelize.STRING(50)
    },
    phone: {
        type: sequelize.Sequelize.STRING(30)
    },
    mobile: {
        type: sequelize.Sequelize.STRING(30)
    },
    fax: {
        type: sequelize.Sequelize.STRING(30)
    }
}, {
    paranoid: true
});

Address.belongsTo(Country);
