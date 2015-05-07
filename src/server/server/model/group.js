var sequelize = require('../config').getSequelize();

module.exports = sequelize.define('Group', {
    id: {
        type: sequelize.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    group: {
        type: sequelize.Sequelize.STRING,
        unique: true,
        allowNull: false
    }
}, {
    timestamps: false
});
