var sequelize = require('../../config').getSequelize();

module.exports = sequelize.define('Title', {
    id: {
        type: sequelize.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: sequelize.Sequelize.STRING,
        unique: true,
        allowNull: false
    }
}, {
    timestamps: false
});
