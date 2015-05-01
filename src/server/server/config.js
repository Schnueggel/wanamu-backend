'use strict';

var mysql = require('mysql'),
    Sequelize = require('sequelize'),
    pool = null;

var sequelize = new Sequelize('sequelize', 'sequelize', 'sequelize', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

var config = {
    debug: process.env.NAUTIC_DEBUG === '1' ? true : false,
    mysql: {
        port: 3306,
        host: 'localhost',
        user: 'nautic',
        password: 'nautic',
        database: 'nautic'
    },
    getMysqlPool: function () {
        return pool;
    },
    getSequelize: function () {
        return sequelize;
    },
    port: process.env.NAUTIC_PORT || 3000
}

pool = mysql.createPool(config.mysql);

module.exports = config;
