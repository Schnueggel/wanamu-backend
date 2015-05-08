'use strict';

var sequelize = require('../config').getSequelize(),
    User = require('./user.js'),
    Category = require('./category.js'),
    Country = require('./lookup/country.js'),
    PaymentMethod = require('./lookup/payment-method.js'),
    Condition = require('./lookup/condition.js');

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
    title: {
        type: sequelize.Sequelize.STRING
    },
    constructionYear: {
        type: sequelize.Sequelize.INTEGER
    },
    length: {
        type: sequelize.Sequelize.STRING
    },
    width: {
        type: sequelize.Sequelize.STRING
    },
    depth: {
        type: sequelize.Sequelize.STRING
    },
    weightTo: {
        type: sequelize.Sequelize.INTEGER
    },
    description: {
        type: sequelize.Sequelize.TEXT
    },
    shortDescription: {
        type: sequelize.Sequelize.STRING
    },
    motorType: {
        type: sequelize.Sequelize.ENUM('einzelmot', 'doppelmot', '')
    },
    motorFuel: {
        type: sequelize.Sequelize.ENUM('diesel','benzin','gas','elektro','hybrid','','brennstofzelle')
    },
    motorName: {
        type: sequelize.Sequelize.STRING
    },
    motorCount: {
        type: sequelize.Sequelize.INTEGER
    },
    motorYear: {
        type: sequelize.Sequelize.INTEGER
    },
    motorPS: {
        type: sequelize.Sequelize.STRING
    },
    motorKW: {
        type: sequelize.Sequelize.STRING
    },
    price: {
        type: sequelize.Sequelize.STRING
    },
    contructionYear: {
        type: sequelize.Sequelize.STRING
    },
    sellType: {
        type: sequelize.Sequelize.ENUM('festpreis','anfrage','vbvhs','','gegengebot')
    },
    location: {
        type: sequelize.Sequelize.STRING
    },
    coords: {
        type: sequelize.Sequelize.STRING
    },
    zipcode: {
        type: sequelize.Sequelize.STRING
    },
    charterFrom: {
        type: sequelize.Sequelize.STRING
    },
    charterTo: {
        type: sequelize.Sequelize.STRING
    },
    chartMonth: {
        type: sequelize.Sequelize.STRING
    },
    image1: {
        type: sequelize.Sequelize.STRING
    },
    image2: {
        type: sequelize.Sequelize.STRING
    },
    image3: {
        type: sequelize.Sequelize.STRING
    },
    image4: {
        type: sequelize.Sequelize.STRING
    },
    image5: {
        type: sequelize.Sequelize.STRING
    },
    video: {
        type: sequelize.Sequelize.STRING
    },
    pdfInfo: {
        type: sequelize.Sequelize.STRING
    },
    pdfExpose: {
        type: sequelize.Sequelize.STRING
    },
    showPhone: {
        type: sequelize.Sequelize.INTEGER
    },
    showAddress: {
        type: sequelize.Sequelize.INTEGER
    },
    showFax: {
        type: sequelize.Sequelize.INTEGER
    },
    showWeb: {
        type: sequelize.Sequelize.INTEGER
    },
    orderType: {
        type: sequelize.Sequelize.ENUM('Text', 'Bild1', 'Bild2')
    },
    confirmedAt: {
        type: sequelize.Sequelize.DATE
    },
    weightTons: {
        type: sequelize.Sequelize.STRING
    }}, {
    paranoid: true
});

Listing.belongsTo(User, {foreignKey: 'user'});
Listing.belongsTo(Category, { foreignKey: 'category'});
Listing.belongsTo(Country, { foreignKey : 'country'});
Listing.belongsTo(PaymentMethod, { foreignKey : 'paymentMethod'});
Listing.belongsTo(Condition, { foreignKey: 'condition'});

module.exports = Listing;
