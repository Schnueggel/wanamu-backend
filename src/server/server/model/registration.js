let sequelize = require('../config/sequelize'),
    crypto = require('crypto'),
    errors = require('../util/error'),
    co = require('co'),
    _ = require('lodash');

/**
 * Registration
 * @type {*|{}|Model}
 */
let Registration = sequelize.define('Registration', {
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
        type: sequelize.Sequelize.STRING,
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
            let without = ['id', 'hash'];

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
            let without = [];

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

    let sha256 = crypto.createHash('sha256');
    sha256.update(registration.UserId + 'wanamu', 'utf8');
    registration.confirmhash = sha256.digest('hex');

    if (registration.confirmhash.length < 5) {
        throw new errors.ServerError('Unable to create a valid confirmation hash');
    }
}

module.exports = Registration;
