'use strict';

let nconf = require('nconf');
let fs = require('fs'),
    _ = require('lodash');

// ==========================================================================
// ENVIRONMENT VARS
// ==========================================================================
const DEVELOPMENT = 'development';
const TEST = 'test';
const PRODUCTION = 'production';
const STAGING = 'staging';

/**
 * Config File
 */
export class Config {

    constructor() {
        this.nconf = nconf;
        this.environments = [DEVELOPMENT, TEST, PRODUCTION, STAGING];
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
        this.env = nconf.get(this.statics.WU_ENV);

        console.log(`Generate config for: ${this.env}`);

        if (!_.contains(this.environments, this.env)) {
            throw new Error(`Invalid server environment found: ${this.env}`);
        }

        // =============================================================================================
        // The default config file
        // =============================================================================================
        nconf.file({file: __dirname + '/json/default.json'});

        // =============================================================================================
        // Test inherits from development
        // =============================================================================================
        if (this.isTest()) {
            let path  = `${__dirname}/json/${DEVELOPMENT}.json`;
            nconf.file('development', {file: path });
        }
        // =============================================================================================
        // Load the environment specific config
        // =============================================================================================
        let envConfigPath = `${__dirname}/json/${this.env.toLowerCase()}.json`;
        nconf.file('envconfig', { file: envConfigPath });

        // =============================================================================================
        // If a local.json exist it will overwrite any config
        // =============================================================================================
        if (fs.existsSync(__dirname + '/json/local.json')) {
            nconf.file('local', {file: __dirname + '/json/local.json'});
        }
    }

    get statics() {
        return {
            PORT:'port',
            PORT_SSL:'portssl',
            SEQUELIZE: 'sequelize',
            WU_ENV: 'WU_ENV',
            WU_HTTP_AUTH: 'WU_HTTP_AUTH',
            WU_HTTP_USER: 'WU_HTTP_USER',
            WU_HTTP_PASSWORD: 'WU_HTTP_PASSWORD',
            WU_DB_HOST: 'WU_DB_HOST',
            WU_DB_NAME: 'WU_DB_NAME',
            WU_DB_USER: 'WU_DB_USER',
            WU_DB_PORT: 'WU_DB_PORT',
            WU_DB_PASSWORD: 'WU_DB_PASSWORD',
            WU_BACKEND_CERT: 'WU_BACKEND_CERT',
            WU_BACKEND_KEY: 'WU_BACKEND_CERT',
            WU_BACKEND_PFX: 'WU_BACKEND_PFX',
            WU_MAIL_HOST: 'WU_MAIL_HOST',
            WU_MAIL_PASSWORD: 'WU_MAIL_PASSWORD',
            WU_MAIL_USER: 'WU_MAIL_USER',
            WU_MAIL_FROM: 'WU_MAIL_FROM'
        };
    }

    isDevelopment() {
        return this.env === DEVELOPMENT;
    }

    isProduction() {
        return this.env === PRODUCTION;
    }

    isStaging() {
        return this.env === STAGING;
    }

    isTest() {
        return this.env === TEST;
    }

    /**
     * Returns the confirmation url
     * @param hash
     * @returns {*}
     */
    getConfirmationUrl(hash) {
        return nconf.get('webhost') + nconf.get('url').confirmation.replace('${hash}', hash);
    }

    /**
     * Returns the default mail for testing
     */
    getTestMail1() {
        return nconf.get('testmail1');
    }

    /**
     * Returns the url of the home page for the webfrontend
     * @returns {*}
     */
    getWebhomeUrl() {
        return nconf.get('webhost') + nconf.get('webhome');
    }

    /**
     * Return nconf object
     * @returns {*|exports|module.exports|nconf}
     */
    getNconf() {
        return this.nconf;
    }

    /**
     * Wrapper for nconf.get
     * @param key
     * @returns {*}
     */
    get(key) {
        return this.nconf.get(key);
    }

    /**
     * Wrapper for nconf.set
     * @param key
     * @param value
     */
    set(key, value) {
        this.nconf.set(key, value);
    }

    get PORT () {
        return this.get(this.statics.PORT);
    }

    get PORTSSL () {
        return this.get(this.statics.PORT_SSL);
    }

    get WU_BACKEND_KEY() {
        return this.get(this.statics.WU_BACKEND_KEY);
    }

    get WU_BACKEND_CERT() {
        return this.get(this.statics.WU_BACKEND_CERT);
    }

    get WU_BACKEND_PFX() {
        return this.get(this.statics.WU_BACKEND_PFX);
    }

    get WU_DB_PORT() {
        return this.get(this.statics.WU_DB_PORT);
    }

    get WU_DB_HOST() {
        return this.get(this.statics.WU_DB_HOST);
    }

    get WU_DB_PASSWORD() {
        return this.get(this.statics.WU_DB_PASSWORD);
    }

    get WU_DB_USER() {
        return this.get(this.statics.WU_DB_USER);
    }

    get WU_DB_NAME() {
        return this.get(this.statics.WU_DB_NAME);
    }

    get SEQUELIZE() {
        return this.get(this.statics.SEQUELIZE);
    }

    get WU_MAIL_FROM() {
        return this.get(this.statics.WU_MAIL_FROM);
    }

    /**
     * Get Mail Transport configuration
     * @returns {{host: *, auth: {user: *, password: *}}}
     */
    get mailerTransportConfig() {
        return {
            host: this.get(this.statics.WU_MAIL_HOST),
            ignoreTLS: true,
            auth: {
                user: this.get(this.statics.WU_MAIL_USER),
                pass: this.get(this.statics.WU_MAIL_PASSWORD)
            }
        };
    }
}


// =============================================================================================
// Export
// =============================================================================================
module.exports = new Config();

