'use strict';

var mysql = require('mysql'),
    Sequelize = require('sequelize'),
    nconf = require('nconf'),
    pool = null;


nconf.argv()
    .env()
    .file({file: __dirname + '/default.json'})
    .file('env', {file: __dirname + '/' + nconf.get('NODE_ENV').toLowerCase() + '.json'});

var sequelize = new Sequelize('sequelize', 'sequelize', 'sequelize', nconf.get('sequelize'));

pool = mysql.createPool(nconf.get('mysql'));

nconf.getMysqlPool =  function () { return pool; };
nconf.getSequelize = function () { return sequelize; };

module.exports = nconf;
