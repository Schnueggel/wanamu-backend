'use strict';
/**
 * Created by Christian on 5/6/2015.
 */

var sequelize = require('../config').getSequelize();

var Category = sequelize.define('Category', {
    id : {
        type: sequelize.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: sequelize.Sequelize.STRING
    },
    key: {
        type: sequelize.Sequelize.INTEGER
    },
    parent: {
        type: sequelize.Sequelize.INTEGER
    }
});

Category.belongsTo(Category, {foreignKey: 'parent'});

module.exports = Category;
