'use strict';

var mysql = require('mysql'),
    Sequelize = require('sequelize'),
    nconf = require('nconf'),
    pool = null;


nconf.argv()
    .env();

var env = nconf.get('NODE_ENV') || 'development';

nconf.file({file: __dirname + '/default.json'})
    .file('env', {file: __dirname + '/' + env.toLowerCase() + '.json'});

console.log(env);
var sequelize = new Sequelize(nconf.get('mysql:database'), nconf.get('mysql:user'), nconf.get('mysql:password'), nconf.get('sequelize'));

pool = mysql.createPool(nconf.get('mysql'));

nconf.getMysqlPool =  function () { return pool; };
nconf.getSequelize = function () { return sequelize; };

module.exports = nconf;
