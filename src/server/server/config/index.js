'use strict';

var nconf = require('nconf');
var fs = require('fs');


// ==========================================================================
// ENVIRONMENT VARS
// ==========================================================================
var DEVELOPMENT = 'development';
var TEST = 'test';
var PRODUCTION = 'production';
const STAGING = 'staging';

// =============================================================================================
// Constant keys
// =============================================================================================
nconf.statics = {
    SEQUELIZE: 'sequelize',
    WU_ENV: 'WU_ENV',
    WU_HTTP_AUTH: 'WU_HTTP_AUTH',
    WU_HTTP_USER: 'WU_HTTP_USER',
    WU_HTTP_PASSWORD: 'WU_HTTP_PASSWORD',
    WU_DB_HOST: 'WU_DB_HOST',
    WU_DB_NAME: 'WU_DB_NAME',
    WU_DB_USER: 'WU_DB_USER',
    WU_DB_PASSWORD: 'WU_DB_PASSWORD'
};

var environments = [DEVELOPMENT, TEST, PRODUCTION, STAGING];
// ==========================================================================
// Convenient methods for checking the environment
// ==========================================================================
nconf.isDevelopment = function() {return env === DEVELOPMENT;};
nconf.isProduction = function() {return env === PRODUCTION;};
nconf.isStaging = function() {return env === STAGING;};
nconf.isTest = function() {return env === TEST;};

// =============================================================================================
// Not sure if this should be loaded first or last. At moment it will be loaded first and
// And overwritten ny the config files
// =============================================================================================
nconf.argv();
nconf.env({
    separator: '__',
    match: /WANAMU_.+/
});

// =============================================================================================
// Check for correct environment variable
// =============================================================================================
var env = nconf.get(nconf.statics.WU_ENV);
nconf.set('env', env);

if (environments.indexOf(env) === -1) {
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
    nconf.file('development', {file: __dirname + '/json/development.json'});
}
// =============================================================================================
// Load the environment specific config
// =============================================================================================
nconf.file('envconfig', {file: __dirname + '/json/' + env.toLowerCase() + '.json'});

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
/**
 * Returns the default mail for testing
 */
nconf.getTestMail1 = function() {
    return nconf.get('testmail1');
};

/**
 * Returns the url of the home page for the webfrontend
 * @returns {*}
 */
nconf.getWebhomeUrl = function(){
    return nconf.get('webhost') + nconf.get('webhome');
};

// =============================================================================================
// Export
// =============================================================================================
module.exports = nconf;
