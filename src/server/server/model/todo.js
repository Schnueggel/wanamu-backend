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
         *
         * @returns {string[]}
         */
        getUpdateFields : function(){
            return ['description', 'color', 'title', 'alarm'];
        },

        /**
         * @param isAdmin
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

module.exports = Todo;
