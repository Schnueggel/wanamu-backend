'use strict';

var User = require('../model/user'),
    Profile = require('../model/profile'),
    ErrorUtil = require('../util/error');

/**
 * ######################################################################################
 * ######################################################################################
 * Get all friends
 * ######################################################################################
 * ######################################################################################
 */
function* getList() {
    var user = this.req.user,
        isAdmin = user.isAdmin(),
        result = {
            error: null,
            success: false,
            data: []
        };

    this.body = result;

    var friends = yield this.req.user.getFriends({
        include : [
            {
                model: Profile,
                attributes: ['id', 'firstname', 'lastname']
            }
        ],
        attributes: ['id']
    });

    result.data = friends.map(function(friend){ return friend.get({plain: true}) });
    result.success = true;
}


module.exports = {
    list : getList
};
