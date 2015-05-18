var sequelize = require('../config/sequelize'),
    ErrorUtil = require('../util/error'),
    TodoList = require('./todolist'),
    co = require('co'),
    bcrypt = require('../config/bcrypt');

/**
 * User Model
 * @type {*|{}|Model}
 */
var User = sequelize.define('User', {
    id : {
        type: sequelize.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: sequelize.Sequelize.STRING(40),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                msg: 'Valid Email is nessecary.'
            }
        }
    },
    salutation: {
        type: sequelize.Sequelize.ENUM('mr', 'mrs'),
        allowNull: false
    },
    title: {
        type: sequelize.Sequelize.STRING(15),
        allowNull: true
    },
    firstname: {
        type: sequelize.Sequelize.STRING(50),
        allowNull: false
    },
    lastname: {
        type: sequelize.Sequelize.STRING(50),
        allowNull: false
    },
    password: {
        type: sequelize.Sequelize.CHAR(60).BINARY,
        allowNull: false,
        validate: {
            min: 8
        }
    },
    website: {
        type: sequelize.Sequelize.STRING(50),
        validate: {
            isUrl: {
                msg: 'If Website is given. It must be valid url'
            }
        }
    },
    birthday: {
        type: sequelize.Sequelize.DATE,
        defaultValue: null,
        validate: {
            isAfter: {
                args: '1900-01-01',
                msg: 'Birthday before 1900-01-01 are not allowed'
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
        beforeBulkCreate: co.wrap(beforeBulkCreate),
        beforeCreate: co.wrap(beforeCreate)
    },

    instanceMethods: {
        comparePassword: comparePassword
    }
});

User.hasMany(TodoList);

module.exports = User;

/**
 * ######################################################################################
 * ######################################################################################
 * Helper Functions
 * ######################################################################################
 * ######################################################################################
 */

function* beforeBulkCreate (users, options){
    for(var i = 0; i < users.length; i++) {
        yield* beforeCreate(users[i], options);
    }
}
/**
 * After Create Hook
 * @param user
 * @param options
 * @param fn only exists if the signature of the hook has a third argument but co.wrap(afterCreate) creates function(){}
 *
 */
function* beforeCreate(user, options){
    // ==========================================================================
    // Create Salt
    // ==========================================================================
    try {
        user.password = yield bcrypt.hashAndSalt(user.password);
    } catch(err) {
        throw new ErrorUtil.UserPasswordNotCreated();
    }
}

function comparePassword(passwordCandidate) {
    var userPassword = this.password;
    return bcrypt.compare(passwordCandidate, userPassword);
}
