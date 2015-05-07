'use strict';

var sequelize = require('../config').getSequelize(),
    Listing = require('./listing.js');

var Toplisting = sequelize.define('Toplisting', {
    id : {
        type: sequelize.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
}, {
    paranoid: true
});

Toplisting.belongsTo(Listing);

module.exports = Toplisting;
