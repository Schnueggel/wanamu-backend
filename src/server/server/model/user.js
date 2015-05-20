var sequelize = require('../config/sequelize'),
    ErrorUtil = require('../util/error'),
    TodoList = require('./todolist'),
    _ = require('lodash'),
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
    group: {
        type: sequelize.Sequelize.ENUM('admin', 'user'),
        defaultValue: 'user'
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
        type: sequelize.Sequelize.DATE,
        allowNull: true,
        defaultValue: null
    }}, {
    // ==========================================================================
    // OPTIONS
    // ==========================================================================
    paranoid: true,

    hooks: {
        beforeBulkCreate: co.wrap(beforeBulkCreate),
        beforeCreate: co.wrap(beforeCreate),
        beforeUpdate: co.wrap(beforeUpdate)
    },
    classMethods : {
        /**
         * Helper function to get a list of  the fields
         * @returns {String[]}
         */
        getAttribKeys: function() {
            if (this.$attribkeys === undefined) {
                this.$attribkeys = _.keys(this.attributes);
            }
            return this.$attribkeys;
        },
        /**
         * Fields that can be written when creating this model
         * @returns {String[]}
         */
        getCreateFields: function() {
            return  _.without(this.getAttribKeys(), 'createdAt', 'updatedAt', 'deletedAt', 'banned');
        },
        /**
         * Returns a list of fields that should be visible to users
         * @returns {string[]}
         */
        getVisibleFields: function(){
            return [ 'id', 'birthday', 'website', 'lastname', 'firstname', 'title', 'createdAt', 'email', 'salutation'];
        }
    },
    instanceMethods: {
        comparePassword: comparePassword,
        isAdmin: function() {
            return this.group === 'admin';
        }
    }
});

User.hasMany(TodoList, {
    // ==========================================================================
    // We prevent UserId foreignKey in TodoList from beeing null
    // ==========================================================================
    onDelete: 'CASCADE',
    foreignKey: {allowNull: false }
});

module.exports = User;

/**
 * ######################################################################################
 * ######################################################################################
 * Helper Functions
 * ######################################################################################
 * ######################################################################################
 */

/**
 * Before Bulk create
 * @param users
 * @param options
 */
function* beforeBulkCreate (users, options){
    for(var i = 0; i < users.length; i++) {
        yield* beforeCreate(users[i], options);
    }
}
/**
 * Before Create Hook
 * @param user
 * @param options
 * @param fn only exists if the signature of the hook has a third argument but co.wrap(afterCreate) creates function(){}
 *
 */
function* beforeCreate(user, options){
    yield hashPassword(user);
}
/**
 * Before Update Hook
 * @param user
 * @param options
 */
function* beforeUpdate(user, options){
    yield hashPassword(user);
}

/**
 * Hashs the user password
 * @param user
 */
function* hashPassword(user) {
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
