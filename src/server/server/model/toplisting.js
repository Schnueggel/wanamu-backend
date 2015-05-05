'use strict';

var sequelize = require('../config').getSequelize(),
    Listing = require('./listing.js');

var Toplisting = sequelize.define('Toplisting', {
    id : {
        type: sequelize.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
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

Toplisting.belongsTo(Listing);

module.exports = Toplisting;
