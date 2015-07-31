let sequelize = require('../config/sequelize');

/**
 * Friends
 * @type {*|{}|Model}
 */
let Friends = sequelize.define('Friends', {
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
