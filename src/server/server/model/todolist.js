import sequelize from '../config/sequelize';
import Todo from './todo';
import _ from 'lodash';

/**
 * TodoList Model
 * @type {Model}
 */
const TodoList = sequelize.define('TodoList', {
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
            let without = [],
                attribskeys = this.getAttribKeys();
            if (!isAdmin) {
                without = without.concat(['deletedAt', 'UserId']);
            } else {
                attribskeys.push('UserId');
            }
            return  _.difference(attribskeys,  without);
        },

        /**
         * Returns all visible fields
         * @param {boolean} isAdmin
         * @returns {string[]}
         * @name TodoList.getVisibleFields
         */
        getVisibleFields : function(isAdmin) {
            let without = [],
                attribkeys = this.getAttribKeys();

            if (!isAdmin) {
                without = without.concat(['deletedAt']);
            }
            return  _.difference(attribkeys,  without);
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

TodoList.hasMany(Todo,  { onDelete: 'cascade' });
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


export default TodoList;
