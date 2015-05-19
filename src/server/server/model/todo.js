var sequelize = require('../config/sequelize');

/**
 * TodoModel
 * @type {*|{}|Model}
 */
var Todo = sequelize.define('Todo', {
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
        getUpdateableFields : function(){
            return ['description', 'color', 'title', 'alarm'];
        }
    }
});

function beforeUpdate(user){

}

module.exports = Todo;
