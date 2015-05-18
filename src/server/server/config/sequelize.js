/**
 * Created by Christian on 5/18/2015.
 */

var nconf = require('../config'),
    Sequelize = require('sequelize');

module.exports = new Sequelize(nconf.get('mysql:database'), nconf.get('mysql:user'), nconf.get('mysql:password'), nconf.get('sequelize'));
