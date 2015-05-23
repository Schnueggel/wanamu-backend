var sequelize = require('../config/sequelize'),
    _ = require('lodash');

/**
 * TodoModel
 * @type {*|{}|Model}
 */
var Todo = sequelize.define('Todo', {
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
    description: {
        type: sequelize.Sequelize.TEXT,
        allowNull: true
    },
    title: {
        type: sequelize.Sequelize.STRING(255),
        allowNull: false
    },
    color: {
        type: sequelize.Sequelize.STRING(10),
        allowNull: true
    },
    alarm: {
        type: sequelize.Sequelize.DATE,
        allowNull: true
    }}, {
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
         */
        getCreateFields: function(isAdmin) {
            return this.getUpdateFields(isAdmin);
        },
        /**
         * @param {boolean} isAdmin
         * @returns {string[]}
         */
        getUpdateFields : function(isAdmin){
            var without = [];

            if (!isAdmin) {
                without = without.concat(['deletedAt']);
            }
            return  _.difference(this.getAttribKeys(),  without);
        },

        /**
         * @param {boolean} isAdmin
         * @returns {string[]}
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

/**
 * Returns all visible fields
 * @param {boolean} isAdmin
 * @returns {string[]}
 * @name Todo.getVisibleFields
 */

/**
 * Returns all fields that are allowed for update
 * @param {boolean} isAdmin
 * @returns {string[]}
 * @name Todo.getUpdateFields
 */

/**
 * Returns all fields that are allowed for creation
 * @param {boolean} isAdmin
 * @returns {string[]}
 * @name Todo.getCreateFields
 */

module.exports = Todo;
