var sequelize = require('../config/sequelize'),
    _ = require('lodash'),
    co = require('co');

/**
 * Friends
 * @type {*|{}|Model}
 */
var Friends = sequelize.define('Friends', {
        accepted : {
            type : sequelize.Sequelize.BOOLEAN,
            defaultValue : false
        },
        invisible : {
            type : sequelize.Sequelize.BOOLEAN,
            defaultValue : false
        }
   },{
    // ==========================================================================
    // OPTIONS
    // ==========================================================================
    classMethods: {
    }
});

module.exports = Friends;
