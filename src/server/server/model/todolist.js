var sequelize = require('../config/sequelize'),
    Todo = require('./todo');

/**
 * TodoList Model
 * @type {*|{}|Model}
 */
var TodoList = sequelize.define('TodoList', {
    id : {
        type: sequelize.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    description: {
        type: sequelize.Sequelize.TEXT,
        allowNull: true
    },
    name: {
        type: sequelize.Sequelize.STRING(55),
        allowNull: false
    }}, {
    // ==========================================================================
    // OPTIONS
    // ==========================================================================
    paranoid: true
});

TodoList.hasMany(Todo);

module.exports = TodoList;
