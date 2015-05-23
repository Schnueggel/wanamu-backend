var sequelize = require('../config/sequelize'),
    Todo = require('./todo');

/**
 * TodoList Model
 * @type {Model}
 */
var TodoList = sequelize.define('TodoList', {
    /**
     * ######################################################################################
     * ######################################################################################
     * !!! When you add field. Think of fields that should be visible to the user and add them
     * to the classMethods getVisibleFields
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
    type: {
        type: sequelize.Sequelize.ENUM('default', 'custom'),
        defaultValue: 'default'
    },
    name: {
        type: sequelize.Sequelize.STRING(55),
        allowNull: false
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
            var without = [],
                attribskeys = this.getAttribKeys();
            if (!isAdmin) {
                without = without.concat(['deletedAt', 'UserId']);
            } else {
                attribskeys.push('UserId');
            }
            return  _.difference(attribskeys,  without);
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
    },
    instanceMethods: {
        /**
         * Check is this is the default list
         * @returns {boolean}
         */
        isDefault : function() {
            return this.type === 'default';
        }
    },
    indexes : [
        // ==========================================================================
        // Make todolist name unique per user
        // ==========================================================================
        {
            unique: true,
            fields: ['name', 'UserId']
        }
    ]
});

TodoList.hasMany(Todo);

/**
 * Returns all visible fields
 * @param {boolean} isAdmin
 * @returns {string[]}
 * @name TodoList.getVisibleFields
 */

/**
 * Returns all fields that are allowed for update
 * @param {boolean} isAdmin
 * @returns {string[]}
 * @name TodoList.getUpdateFields
 */

/**
 * Returns all fields that are allowed for creation
 * @param {boolean} isAdmin
 * @returns {string[]}
 * @name TodoList.getCreateFields
 */

module.exports = TodoList;
