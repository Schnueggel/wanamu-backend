'use strict';

let nconf = require('../config'),
    Sequelize = require('sequelize');

let sequelize = nconf.get(nconf.statics.SEQUELIZE);

sequelize.host = nconf.get(nconf.statics.WU_DB_HOST);

module.exports = new Sequelize(nconf.get(nconf.statics.WU_DB_NAME), nconf.get(nconf.statics.WU_DB_USER), nconf.get(nconf.statics.WU_DB_PASSWORD), sequelize);
