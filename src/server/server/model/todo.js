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
        type: sequelize.Sequelize.STRING(255),
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
        type: sequelize.Sequelize.STRING,
        allowNull: true
    },
    repeatMonthly: {
        type: sequelize.Sequelize.STRING,
        allowNull: true
    },
    repeatYearly: {
        type: sequelize.Sequelize.STRING,
        allowNull: true
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
    // ==========================================================================
    // HOOKS
    // ==========================================================================
    hooks: {
        afterFind: co.wrap(afterFind),
        beforeValidate: co.wrap(beforeValidate),
        beforeDestroy: co.wrap(beforeDestroy)
    },
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
        filterOut: function (todo) {
            _.forEach(['repeatWeekly', 'repeatMonthly', 'repeatYearly'], function (v) {
                if (_.isString(todo[v]) && todo[v].length > 0) {
                    todo[v] = todo[v].split(',');
                } else {
                    todo[v] = [];
                }
            });
            return todo;
        },
        filterIn: function (todo) {
            if (_.isArray(todo.repeatWeekly)) {
                todo.repeatWeekly = todo.repeatWeekly.join(',');
            }
            if (_.isArray(todo.repeatMonthly)) {
                todo.repeatMonthly = todo.repeatMonthly.join(',');
            }
            if (_.isArray(todo.repeatYearly)) {
                todo.repeatYearly = todo.repeatYearly.join(',');
            }
            return todo;
        }
    }
});

function* beforeDestroy(todo) {
    if (todo) {
        todo.filterIn(todo);
    }
    return;
}

function* beforeValidate(todo) {
    if (todo) {
        todo.filterIn(todo);
    }
    return;
}
function* afterFind(todo) {
    if (todo) {
        todo.filterOut(todo);
    }

    return;
}


module.exports = Todo;
