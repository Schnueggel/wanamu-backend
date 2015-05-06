/**
 * Created by Christian on 5/5/2015.
 */
var sequelize = require('../../config').getSequelize();

module.exports = sequelize.define('Salutation', {
    id : {
        type: sequelize.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: sequelize.Sequelize.STRING,
        unique: true
    }
});
