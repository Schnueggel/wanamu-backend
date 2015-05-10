'use strict';
var Address = require('./address'),
    Salutation = require('./lookup/salutation.js'),
    UserGroup = require('./user-group.js'),
    sequelize = require('../config').getSequelize();

var User = sequelize.define('User', {
    id : {
        type: sequelize.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    customerNumber: {
        type: sequelize.Sequelize.STRING(10),
        unique: true
    },
    email: {
        type: sequelize.Sequelize.STRING(40),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                msg: 'Es muss eine gültige E-Mail Adresse angegeben werden.'
            }
        }
    },
    title: {
        type: sequelize.Sequelize.STRING(15),
        allowNull: true
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
                msg: 'Es muss keine oder eine gültige Webseite angegeben werden.'
            }
        }
    },
    birthday: {
        type: sequelize.Sequelize.DATE,
        defaultValue: null,
        validate: {
            isAfter: {
                args: '1900-01-01',
                msg: 'Das Geburtsdatum darf nicht vor dem 01.01.1900 liegen.'
            }
        }
    },
    banned: {
        type: sequelize.Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }}, {
    // ==========================================================================
    // OPTIONS
    // ==========================================================================
    paranoid: true,
    hooks: {
        afterCreate: function(user, options, fn){
            user.getUserGroup().then(function(group){
                user.customerNumber = group.flag.toUpperCase() + zeroPad(user.id, 5);
                user.save().then(function(){
                    fn(null, user);
                }).catch(function(err){
                    console.error(err);
                    throw new Error('Unable to create customer number');
                });
            }).catch(function(err){
                console.error(err);
                throw new Error('Unable to create customer number');
            });
        }
    }
});

function zeroPad(num, numZeros) {
    var n = Math.abs(num);
    var zeros = Math.max(0, numZeros - Math.floor(n).toString().length );
    var zeroString = Math.pow(10,zeros).toString().substr(1);
    if( num < 0 ) {
        zeroString = '-' + zeroString;
    }

    return zeroString+n;
}

User.belongsTo(Salutation, { as:'Salutation', foreignKey: 'salutation', allowNull: true });
User.belongsTo(UserGroup,  { as:'UserGroup', foreignKey: 'userGroup', allowNull: false });
User.hasMany(Address, {foreignKey: 'user'});

module.exports = User;

