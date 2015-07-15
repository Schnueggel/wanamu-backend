/**
 * Created by Christian on 5/18/2015.
 */

var nconf = require('../config'),
    Sequelize = require('sequelize');

var sequelize = nconf.get('sequelize');

sequelize.host = nconf.get('WANAMU_DB_HOST');

module.exports = new Sequelize(nconf.get('WANAMU_DATABASE'), nconf.get('WANAMU_DB_USER'), nconf.get('WANAMU_DB_PASSWORD'), sequelize);
