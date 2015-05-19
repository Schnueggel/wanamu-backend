var sequelize = require('../config/sequelize'),
    Todo = require('./todo');

/**
 * TodoList Model
 * @type {*|{}|Model}
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
         * Returns a list of fields that should be visible to users
         * @returns {string[]}
         */
        getVisibleFields: function(){
            return [ 'id', 'description', 'name', 'createdAt', 'updatedAt', 'UserId']
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

module.exports = TodoList;
