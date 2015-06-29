var sequelize = require('../config/sequelize'),
    _ = require('lodash');

/**
 * SettingModel
 * @type {*|{}|Model}
 */
var Setting = sequelize.define('Setting', {
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
    color1: {
        type: sequelize.Sequelize.STRING(30),
        defaultValue : 'rgba(255, 223, 2, 0.8)', // yellow
        allowNull: true
    },
    color2: {
        type: sequelize.Sequelize.STRING(30),
        defaultValue : 'rgba(0, 128, 0, 0.8)', // green
        allowNull: true
    },
    color3: {
        type: sequelize.Sequelize.STRING(30),
        defaultValue : 'rgba(0, 90, 255, 0.8)', // blue
        allowNull: true
    },
    color4: {
        type: sequelize.Sequelize.STRING(30),
        defaultValue : 'rgba(0, 0, 0, 0.8)', // black
        allowNull: true
    },
    color5: {
        type: sequelize.Sequelize.STRING(30),
        defaultValue : 'rgba(255, 0, 0, 0.8)', // red
        allowNull: true
    }}, {
    // ==========================================================================
    // OPTIONS
    // ==========================================================================
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
         * @name Todo.getCreateFields
         */
        getCreateFields: function(isAdmin) {
            return this.getUpdateFields(isAdmin);
        },
        /**
         * @param {boolean} isAdmin
         * @returns {string[]}
         * @name Todo.getUpdateFields
         */
        getUpdateFields : function(isAdmin){
            var without = [];

            return  _.difference(this.getAttribKeys(),  without);
        },

        /**
         * @param {boolean} isAdmin
         * @returns {string[]}
         * @name Todo.getVisibleFields
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

module.exports = Setting;
