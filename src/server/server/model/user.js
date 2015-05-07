'use strict';
var Address = require('./address'),
    Salutation = require('./lookup/salutation.js'),
    Title = require('./lookup/title.js'),
    Group = require('./group.js'),
    sequelize = require('../config').getSequelize();

var User = sequelize.define('User', {
    id : {
        type: sequelize.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    customerNo: {
        type: sequelize.Sequelize.STRING(10),
        unique: true
    },
    email: {
        type: sequelize.Sequelize.STRING(40),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                msg: "Es muss eine gültige E-Mail Adresse angegeben werden."
            }
        }
    },
    firstName: {
        type: sequelize.Sequelize.STRING(50),
        allowNull: false

    },
    lastName: {
        type: sequelize.Sequelize.STRING(50),
        allowNull: false
    },
    password: {
        type: sequelize.Sequelize.CHAR(60).BINARY,
        allowNull: false
    },
    companyName: {
        type: sequelize.Sequelize.STRING(50)
    },
    companyContact: {
        type: sequelize.Sequelize.STRING(50)
    },
    oldContactId: {
        type: sequelize.Sequelize.STRING(50)
    },
    website: {
        type: sequelize.Sequelize.STRING(50),
        validate: {
            isUrl: {
                msg: "Es muss keine oder eine gültige Webseite angegeben werden."
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
    },
    banned: {
        type: sequelize.Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    paranoid: true
});

User.belongsTo(Salutation);
User.belongsTo(Title);
User.belongsTo(Group);
User.hasMany(Address, {as: 'Addresses'});

module.exports = User;

