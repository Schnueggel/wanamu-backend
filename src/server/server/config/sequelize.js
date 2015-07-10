/**
 * Created by Christian on 5/18/2015.
 */

var nconf = require('../config'),
    Sequelize = require('sequelize');

var postgres = nconf.get('postgres');
console.log(postgres);
module.exports = new Sequelize(postgres.database,postgres.user, postgres.password, nconf.get('sequelize'));
