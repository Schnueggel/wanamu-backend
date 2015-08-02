import sequelize from '../config/sequelize';

/**
 * @typedef {Object} Friends
 * @namespace models.Friends
 * @type {Friends}
 */
const FriendsModel = sequelize.define('Friends', {
    /**
     * @name FriendId
     * @fieldOf Friends
     * @type number
     */
    /**
     * @name UserId
     * @fieldOf Friends
     * @type number
     */
    /**
     * @name updatedAt
     * @fieldOf Friends
     * @type Date
     */
    /**
     * @name createdAt
     * @fieldOf Friends
     * @type Date
     */
    /**
     * @propertyOf Friends
     */
        accepted : {
            type : sequelize.Sequelize.BOOLEAN,
            defaultValue : false
        },
    /**
     * @propertyOf Friends
     */
        invisible : {
            type : sequelize.Sequelize.BOOLEAN,
            defaultValue : false
        },
    /**
     * @propertyOf Friends
     */
        accepttoken : {
            type : sequelize.Sequelize.STRING(100)
        }
   },{
    // ==========================================================================
    // OPTIONS
    // ==========================================================================
    classMethods: {
    }
});


module.exports = FriendsModel;
