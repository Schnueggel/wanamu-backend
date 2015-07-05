var sequelize = require('../config/sequelize'),
    bcrypt = require('../config/bcrypt'),
    errors = require('../util/error'),
    co = require('co'),
    _ = require('lodash');

/**
 * Registration
 * @type {*|{}|Model}
 */
var Registration = sequelize.define('Registration', {
    /**
     * ######################################################################################
     * ######################################################################################
     * !!! When you add or remove fields updated the class and instance methods
     * ######################################################################################
     * ######################################################################################
     */
    id : {
        type: sequelize.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    confirmhash: {
        type: sequelize.Sequelize.STRING(255),
        allowNull : true,
        unique : true
    },
    lastpassword: {
        type: sequelize.Sequelize.DATE,
        allowNull: true
    },
    lastconfirmation: {
        type: sequelize.Sequelize.DATE,
        allowNull: true
    }}, {
    // ==========================================================================
    // OPTIONS
    // ==========================================================================
    // ==========================================================================
    // HOOKS
    // ==========================================================================
    hooks: {
        beforeCreate: co.wrap(beforeCreate)
    },
    classMethods: {
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
         * @param {boolean} isAdmin
         * @returns {*|string[]}
         * @name Setting.getCreateFields
         */
        getCreateFields: function(isAdmin) {
            return this.getUpdateFields(isAdmin);
        },
        /**
         * @param {boolean} isAdmin
         * @returns {string[]}
         * @name Setting.getUpdateFields
         */
        getUpdateFields : function(isAdmin){
            var without = ['id', 'hash'];

            if (!isAdmin) {
                without.concat(['updatedAt', 'createdAt']);
            }

            return  _.difference(this.getAttribKeys(),  without);
        },

        /**
         * @param {boolean} isAdmin
         * @returns {string[]}
         * @name Setting.getVisibleFields
         */
        getVisibleFields : function(isAdmin) {
            var without = [];

            return  _.difference(this.getAttribKeys(),  without);
        }
    }
});

/**
 * Before Create Hook
 * @param registration
 * @param options
 *
 */
function* beforeCreate(registration, options){
    registration.confirmhash =  yield bcrypt.hashAndSalt(registration.UserId, 4);
    if (registration.confirmhash.length < 5) {
        throw new errors.ServerError('Unable to create a valid confirmation hash');
    }
}

module.exports = Registration;
