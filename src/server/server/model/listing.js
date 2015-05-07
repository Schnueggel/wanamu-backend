'use strict';

var sequelize = require('../config').getSequelize(),
    User = require('./user.js');

var Listing = sequelize.define('Listing', {
    id: {
        type: sequelize.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    listingNr: {
        type: sequelize.Sequelize.STRING,
        unique: true
    },
    category: {
        type: sequelize.Sequelize.STRING
    },
    title: {
        type: sequelize.Sequelize.STRING
    },
    constructionYear: {
        type: sequelize.Sequelize.INTEGER
    },
    motorYear: {
        type: sequelize.Sequelize.INTEGER
    },
    length: {
        type: sequelize.Sequelize.INTEGER
    },
    width: {
        type: sequelize.Sequelize.INTEGER
    },
    weightTo: {
        type: sequelize.Sequelize.INTEGER
    },
    description: {
        type: sequelize.Sequelize.TEXT
    }
}, {
    paranoid: true
});

Listing.belongsTo(User);

module.exports = Listing;
