var sequelize = require('../config/sequelize'),
    _ = require('lodash'),
    co = require('co');

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
    id: {
        type: sequelize.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    description: {
        type: sequelize.Sequelize.TEXT,
        allowNull: true
    },
    title: {
        type: sequelize.Sequelize.STRING(100),
        allowNull: false
    },
    order: {
        type: sequelize.Sequelize.INTEGER,
        defaultValue: 1
    },
    repeat: {
        type: sequelize.Sequelize.BOOLEAN,
        allowNull: true
    },
    repeatWeekly: {
        type: sequelize.Sequelize.ARRAY(sequelize.Sequelize.STRING(2)),
        allowNull: true
    },
    repeatMonthly: {
        type: sequelize.Sequelize.ARRAY(sequelize.Sequelize.STRING(2)),
        allowNull: true
    },
    repeatYearly: {
        type: sequelize.Sequelize.ARRAY(sequelize.Sequelize.STRING(3)),
        allowNull: true
    },
    finished : {
        type: sequelize.Sequelize.BOOLEAN,
        defaultValue: false
    },
    color: {
        type: sequelize.Sequelize.ENUM('color1', 'color2', 'color3', 'color4', 'color5'),
        defaultValue: 'color1',
        allowNull: true
    },
    alarm: {
        type: sequelize.Sequelize.DATE,
        allowNull: true
    }
}, {
    // ==========================================================================
    // OPTIONS
    // ==========================================================================
    paranoid: true,
    classMethods: {
        /**
         * Helper function to get a list of  the fields
         * @returns {String[]}
         */
        getAttribKeys: function () {
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
        getCreateFields: function (isAdmin) {
            return this.getUpdateFields(isAdmin);
        },
        /**
         * @param {boolean} isAdmin
         * @returns {string[]}
         * @name Todo.getUpdateFields
         */
        getUpdateFields: function (isAdmin) {
            var without = ['id'];

            if (!isAdmin) {
                without = without.concat(['createdAt', 'updatedAt']);
            }
            return _.difference(this.getAttribKeys(), without);
        },

        /**
         * @param {boolean} isAdmin
         * @returns {string[]}
         * @name Todo.getVisibleFields
         */
        getVisibleFields: function (isAdmin) {
            var without = [];

            if (!isAdmin) {
                without = without.concat([]);
            }
            return _.difference(this.getAttribKeys(), without);
        }
    },
    instanceMethods: {

    }
});


module.exports = Todo;
