var sequelize = require('../config').getSequelize();

module.exports = sequelize.define('UserGroup', {
    id: {
        type: sequelize.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userGroup: {
        type: sequelize.Sequelize.STRING,
        unique: true,
        allowNull: false
    }
}, {
    timestamps: false
});
