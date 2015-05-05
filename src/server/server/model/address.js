/**
 * Created by Christian on 5/5/2015.
 */
var sequelize = require('../config').getSequelize();

module.exports = sequelize.define('Address', {
    id : {
        type: sequelize.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    street: {
        type: sequelize.Sequelize.STRING
    },
    addition1: {
        type: sequelize.Sequelize.STRING
    },
    addition2: {
        type: sequelize.Sequelize.STRING
    },
    zipcode: {
        type: sequelize.Sequelize.STRING
    },
    city: {
        type: sequelize.Sequelize.STRING
    },
    country: {
        type: sequelize.Sequelize.STRING
    },
    phone: {
        type: sequelize.Sequelize.STRING
    },
    created: {
        type: sequelize.Sequelize.DATE,
        defaultValue: sequelize.Sequelize.NOW
    },
    updated : {
        type: sequelize.Sequelize.DATE,
        defaultValue: null
    },
    deleted : {
        type: sequelize.Sequelize.DATE,
        defaultValue: null
    }
});
