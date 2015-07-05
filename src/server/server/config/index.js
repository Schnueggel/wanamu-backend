'use strict';

var nconf = require('nconf');
var fs = require('fs');

// ==========================================================================
// ENVIRONMENT VARS
// ==========================================================================
var DEVELOPMENT = 'development';
var TEST = 'test';
var PRODUCTION = 'production';
// ==========================================================================
// Convenient methods for checking the environment
// ==========================================================================
nconf.isDevelopment = function() {return env === DEVELOPMENT;};
nconf.isProduction = function() {return env === PRODUCTION;};
nconf.isTest = function() {return env === TEST;};

// =============================================================================================
// Not sure if this should be loaded first or last. At moment it will be loaded first and
// And overwritten ny the config files
// =============================================================================================
nconf.argv();
nconf.env();

// =============================================================================================
// Check for correct environment variable
// =============================================================================================
var env = nconf.get('NODE_ENV');
nconf.set('env', env);
if ([DEVELOPMENT, TEST, PRODUCTION].indexOf(env) === -1) {
    throw new Error('Invalid server environment found:' + env);
}

// =============================================================================================
// The default config file
// =============================================================================================
nconf.file({file: __dirname + '/json/default.json'});

// =============================================================================================
// Test inherits from development
// =============================================================================================
if (nconf.isTest()) {
    nconf.file('env', {file: __dirname + '/json/development.json'});
}
// =============================================================================================
// Load the environment specific config
// =============================================================================================
nconf.file('env', {file: __dirname + '/json/' + env.toLowerCase() + '.json'});

// =============================================================================================
// If a local.json exist it will overwrite any config
// =============================================================================================
if (fs.existsSync( __dirname + '/json/local.json')) {
    nconf.file('local', {file: __dirname + '/json/local.json'});
}

/**
 * Returns the confirmation url
 * @param hash
 * @returns {*}
 */
nconf.getConfirmationUrl = function(hash){
    return nconf.get('webhost') + nconf.get('url').confirmation.replace('${hash}', hash);
};

// =============================================================================================
// Export
// =============================================================================================
module.exports = nconf;
