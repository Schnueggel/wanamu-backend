var sequelize = require('../config/sequelize'),
    _ = require('lodash'),
    co = require('co');

/**
 * Profile
 * @type {*|{}|Model}
 */
var Profile = sequelize.define('Profile', {
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
    salutation: {
        type: sequelize.Sequelize.ENUM('mr', 'mrs', 'neutrum', 'human'),
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
    }},{
    // ==========================================================================
    // OPTIONS
    // ==========================================================================
    // ==========================================================================
    // OPTIONS
    // ==========================================================================
    paranoid: true,
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
            var without = [];

            return  _.difference(this.getAttribKeys(),  without);
        },

        /**
         * @param {boolean} isAdmin
         * @returns {string[]}
         * @name Setting.getVisibleFields
         */
        getVisibleFields : function(isAdmin) {
            var without = [];

            if (!isAdmin) {
                without = without.concat(['deletedAt']);
            }
            return  _.difference(this.getAttribKeys(),  without);
        }
    }
});

module.exports = Profile;
