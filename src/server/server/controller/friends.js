'use strict';

import Profile from '../model/profile';
import User from '../model/user.js';
import { Response } from '../util/response.js';
const ErrorUtil = require('../util/error.js');
const Util = require('../util/util.js');
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
            attributes: ['id']
        });

        response.data = friends.map((friend) => {
            return friend.get({plain: true});
        });
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
        const reponse = new Response(),
            input = context.request.body || {},
            data = input.data || {};

        context.body = reponse;

        if (!data.email) {
            context.status = Util.status.VALIDATION_ERROR;
            reponse.error = new ErrorUtil.ModelValidationError('Not enough data to fullfill request');
            console.error(`[ERROR] User:${context.req.user.id} ${reponse.error.message}`);
            return;
        }

        const user = yield User.findOne({
            where: {
                email: data.email
            }
        });

        if (user === null) {
            context.status = Util.status.NOTFOUND;
            reponse.error = new ErrorUtil.UserNotFound();
            console.error(`[ERROR] User:${context.req.user.id} Email:${data.email} ${reponse.error.message}`);
            return;
        }

        if (user.id === context.req.user.id) {
            context.status = Util.status.VALIDATION_ERROR;
            reponse.error = new ErrorUtil.ModelValidationError('You cannot add your self as friend');
            console.error(`[ERROR] User:${context.req.user.id} Email:${data.email} ${reponse.error.message}`);
            return;
        }

        yield context.req.user.addFriend(user, {});

        reponse.success = true;
    }

}

