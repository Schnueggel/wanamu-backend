'use strict';

let Profile = require('../model/profile');

/**
 * ######################################################################################
 * ######################################################################################
 * Get all friends
 * ######################################################################################
 * ######################################################################################
 */
function* getList() {
    let result = {
            error: null,
            success: false,
            data: []
        };

    this.body = result;

    let friends = yield this.req.user.getFriends({
        include : [
            {
                model: Profile,
                attributes: ['id', 'firstname', 'lastname']
            }
        ],
        attributes: ['id']
    });

    result.data = friends.map((friend) => { return friend.get({plain: true}); });
    result.success = true;
}


module.exports = {
    list : getList
};
