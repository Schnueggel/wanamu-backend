'use strict';

import Profile from '../model/profile';
import User from '../model/user.js';
import { Response } from '../util/response.js';
const ErrorUtil = require('../util/error.js');
const Util = require('../util/util.js');

/**
 * Manage Friends
 */
export class FriendsController {
    /**
     * ######################################################################################
     * ######################################################################################
     * Get all friends
     *
     * Result in something like:
     {
        "data": [
            {
                "id": 203,
                "Profile": null,
                "Friends": {
                    "accepted": false,
                    "invisible": false,
                    "createdAt": "2015-07-31T23:54:22.833Z",
                    "updatedAt": "2015-07-31T23:54:22.833Z",
                    "UserId": 196,
                    "FriendId": 203
                }
            }
        ],
        "success": true,
        "message": null,
        "error": null
     }
     * ######################################################################################
     * ######################################################################################
     */
    * getList(next, context) {
        const response = new Response();

        context.body = response;

        let friends = yield context.req.user.getFriends({
            include: [
                {
                    model: Profile,
                    attributes: ['id', 'firstname', 'lastname']
                }
            ],
            //https://github.com/sequelize/sequelize/blob/master/lib/associations/belongs-to-many.js
            joinTableAttributes: ['accepted', 'updatedAt'],
            attributes: ['id']
        });

        response.data = friends;
        response.success = true;
    }

    /**
     * Adds a friend to the current user
     * Result in:
     {
         "data": [],
         "success": true,
         "message": null,
         "error": null
     }
     * @param {function} next
     * @param {Object} context
     */
    *addFriend(next, context) {
        const response = new Response(),
            user = context.req.user,
            input = context.request.body || {},
            data = input.data || {};

        context.body = response;

        // =============================================================================================
        // Check if there is an email
        // =============================================================================================
        if (!data.email) {
            context.status = Util.status.VALIDATION_ERROR;
            response.error = new ErrorUtil.ModelValidationError('Not enough data to fullfill request');
            console.error(`[ERROR] User:${user.id} ${response.error.message}`);
            return;
        }

        // =============================================================================================
        // Find this new friend user by email
        // =============================================================================================
        const newfriend = yield User.findOne({
            include: [{
                model: Profile
            }],
            where: {
                email: data.email
            }
        });

        // =============================================================================================
        // Check if new friend user exists
        // =============================================================================================
        if (newfriend === null) {
            context.status = Util.status.NOTFOUND;
            response.error = new ErrorUtil.UserNotFound();
            console.error(`[ERROR] User:${user.id} Email:${data.email} ${response.error.message}`);
            return;
        }

        // =============================================================================================
        // User cannot add himself as friend
        // =============================================================================================
        if (newfriend.id === user.id) {
            context.status = Util.status.VALIDATION_ERROR;
            response.error = new ErrorUtil.ModelValidationError('You cannot add your self as friend');
            console.error(`[ERROR] User:${user.id} Email:${data.email} ${response.error.message}`);
            return;
        }

        // =============================================================================================
        // Check if we have already a friendship with this user

        if (yield user.hasFriend(newfriend.id)){
            context.status = Util.status.VALIDATION_ERROR;
            response.error = new ErrorUtil.ModelValidationError('This friend is already in your friendslist');
            console.error(`[ERROR] User:${user.id} Email:${data.email} ${response.error.message}`);
            return;
        }

        // =============================================================================================
        // Check if the other user has already invited us as friend
        // =============================================================================================
        const invitedfriends = yield newfriend.getFriends({
        }, {
            FriendId: user.id
        });

        const newfriendOptions = {
            accepted: false
        };
        // =============================================================================================
        // If the we have beein invited by the other user we immediatly accept friendship on both sides
        // =============================================================================================
        if (invitedfriends.length > 0) {
            invitedfriends[0].Friends.accepted = true;
            invitedfriends[0].Friends.save();
            newfriendOptions.accepted = true;
            //TODO send mail
        }

        // =============================================================================================
        // Add user as friend
        // =============================================================================================
        yield user.addFriend(newfriend, newfriendOptions);

        // =============================================================================================
        // In case we immediatly accept we send IM Used status code (226)
        // =============================================================================================
        if (newfriendOptions.accepted === true) {
            context.status = Util.status.IM_USED;
            response.message = `New Friend ${data.email} has been added`;
        } else {
            response.message = `The user ${data.email} has been invited`;
        }

        response.success = true;
    }
}

