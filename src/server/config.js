var mysql = require('mysql');

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
    port : 3000,
}

var pool = mysql.createPool(config.mysql);

module.exports = config;
