/**
 * Created by Christian on 5/5/2015.
 */
'use strict';
var Address = require('./address'),
    sequelize = require('../config').getSequelize();

var User = sequelize.define('User', {
    id : {
        type: sequelize.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstname: {
        type: sequelize.Sequelize.STRING
    },
    lastname: {
        type: sequelize.Sequelize.STRING
    },
    country: {
        type: sequelize.Sequelize.STRING
    },
    password: {
        type: sequelize.Sequelize.STRING
    },
    email: {
        type: sequelize.Sequelize.STRING
    },
    birthday: {
        type: sequelize.Sequelize.DATE,
        defaultValue: null
    },
    deleted : {
        type: sequelize.Sequelize.DATE,
        defaultValue: null
    }
});


User.hasMany(Address, {'as': 'Addresses'});

module.exports = User;

