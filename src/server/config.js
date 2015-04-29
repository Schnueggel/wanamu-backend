var mysql = require('mysql'),
    Sequelize = require('sequelize');

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
    mysql : {
        port : 3306,
        host : 'localhost',
        user : 'nautic',
        password: 'nautic',
        database: 'nautic'
    },
    getMysqlPool : function() {
        return pool;
    },
    getSequelize : function() {
        return sequelize;
    },
    port : 3000
}

var pool = mysql.createPool(config.mysql);

module.exports = config;
