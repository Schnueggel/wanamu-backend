'use strict';

import config from '../config';
import Sequelize from 'sequelize';

let sequelizeOptions = config.SEQUELIZE;

sequelizeOptions.host = config.WU_DB_HOST;
sequelizeOptions.port = config.WU_DB_PORT;

module.exports = new Sequelize(config.WU_DB_NAME, config.WU_DB_USER, config.WU_DB_PASSWORD, sequelizeOptions);

