'use strict';

let config = require('../config'),
    Sequelize = require('sequelize');

let sequelize = config.get(config.statics.SEQUELIZE);

sequelize.host = config.get(config.statics.WU_DB_HOST);

module.exports = new Sequelize(config.get(config.statics.WU_DB_NAME), config.WU_DB_USER, config.get(config.statics.WU_DB_PASSWORD), sequelize);

