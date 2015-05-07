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
    firstName: {
        type: sequelize.Sequelize.STRING,
        allowNull: false

    },
    lastName: {
        type: sequelize.Sequelize.STRING,
        allowNull: false
    },
    country: {
        type: sequelize.Sequelize.STRING
    },
    password: {
        type: sequelize.Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: sequelize.Sequelize.STRING,
        allowNull: false,
        validate: {
            isEmail: {
                msg: "Es muss eine gültige E-Mail Adresse angegeben werden."
            }
        }
    },
    birthday: {
        type: sequelize.Sequelize.DATE,
        defaultValue: null,
        validate: {
            isAfter: {
                args: "1900-01-01",
                msg: "Das Geburtsdatum darf nicht vor dem 01.01.1900 liegen."
            }
        }
    }
}, {
    paranoid: true
});


User.hasMany(Address, {'as': 'Addresses'});

module.exports = User;

