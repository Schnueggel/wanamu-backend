'use strict';

var mysql = require('mysql'),
    Sequelize = require('sequelize'),
    nconf = require('nconf'),
    pool = null;

// ==========================================================================
// ENVIRONMENT VARS
// ==========================================================================
var DEVELOPMENT = 'development';
var TEST = 'test';
var PRODUCTION = 'production';

nconf.argv()
    .env();


var env = nconf.get('NODE_ENV') || DEVELOPMENT;

if ([DEVELOPMENT, TEST, PRODUCTION].indexOf(env) === -1) {
    throw new Error('Invalid server environment found:' + env);
}

nconf.file({file: __dirname + '/default.json'})
    .file('env', {file: __dirname + '/' + env.toLowerCase() + '.json'})
    .file('local', {file: __dirname + '/local.json'});


nconf.set('env', env);

var sequelize = new Sequelize(nconf.get('mysql:database'), nconf.get('mysql:user'), nconf.get('mysql:password'), nconf.get('sequelize'));

pool = mysql.createPool(nconf.get('mysql'));

nconf.getMysqlPool =  function () { return pool; };
nconf.getSequelize = function () { return sequelize; };

// ==========================================================================
// Convinient methods for checking the environment
// ==========================================================================
nconf.isDevelopment = function() {return env === DEVELOPMENT;};
nconf.isProduction = function() {return env === PRODUCTION;};
nconf.isTest = function() {return env === TEST;};

module.exports = nconf;
