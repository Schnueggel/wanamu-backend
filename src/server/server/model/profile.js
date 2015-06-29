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
    face: {
        type: sequelize.Sequelize.STRING(10),
        allowNull: true
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
    classMethods: {

        /**
         * Helper function to get a list of  the fields
         * @name Profile.getAttributeKeys
         * @returns {String[]}
         *
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
         * @name Profile.getCreateFields
         */
        getCreateFields: function(isAdmin) {
            return this.getUpdateFields(isAdmin);
        },
        /**
         * @param {boolean} isAdmin
         * @returns {string[]}
         * @name Profile.getUpdateFields
         */
        getUpdateFields : function(isAdmin){

            var without = ['id', 'UserId'];

            if (!isAdmin) {
                without.concat([ 'updatedAt', 'createdAt']);
            }

            return  _.difference(this.getAttribKeys(),  without);
        },

        /**
         * @param {boolean} isAdmin
         * @returns {string[]}
         * @name Profile.getVisibleFields
         */
        getVisibleFields : function(isAdmin) {
            var without = [];

            if (!isAdmin) {
                without = without.concat([]);
            }
            return  _.difference(this.getAttribKeys(),  without);
        }
    }
});

module.exports = Profile;
