'use strict';

var nconf = require('nconf');

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

nconf.file({file: __dirname + '/json/default.json'})
    .file('env', {file: __dirname + '/json/' + env.toLowerCase() + '.json'})
    .file('local', {file: __dirname + '/json/local.json'});


nconf.set('env', env);

// ==========================================================================
// Convinient methods for checking the environment
// ==========================================================================
nconf.isDevelopment = function() {return env === DEVELOPMENT;};
nconf.isProduction = function() {return env === PRODUCTION;};
nconf.isTest = function() {return env === TEST;};

module.exports = nconf;
