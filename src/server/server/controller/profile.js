'use strict';

import Profile from '../model/profile';
import {ProfileNotFound, AccessViolation} from '../util/error';
import _ from 'lodash';

/**
 * @namespace controller
 */
export class ProfileController {

    /**
     * Get a Profile by id. A user can only request his own profile. Except admins
     * @param {number} id
     * @param {function} next
     * @param {Object} context
     */
    *getProfile(id, next, context) {
        const user = context.req.user,
            isAdmin = user.isAdmin(),
            result = {
                error: null,
                success: false,
                data: []
            };

        context.body = result;

        let profile = yield Profile.findById(id);

        if (!profile) {
            context.status = 404;
            result.error = new ProfileNotFound();
            return;
        }
        if (isAdmin === false && context.req.user.id !== profile.UserId) {
            context.status = 403;
            result.error = new AccessViolation();
            return;
        }

        result.success = true;

        const resultdata = _.pick(profile.get({plain: true}), Profile.getVisibleFields(isAdmin));

        result.data.push(resultdata);
    }

    /**
     * Updates a profile. Update is the only changing method for profile because it get created with
     * the user and cant exist without it
     * @param {number} id
     * @param {function} next
     * @param {Object} context
     */
    *updateProfile(id, next, context) {
        const user = context.req.user,
            isAdmin = user.isAdmin(),
            input = context.request.body || {},
            data = input.data || {},
            result = {
                error: null,
                success: false,
                data: []
            };

        context.body = result;

        let profile = yield Profile.findById(id);

        if (!profile) {
            context.status = 404;
            result.error = new ProfileNotFound();
            return;
        }

        // ==========================================================================
        // Only admin can update profiles of other user
        // ==========================================================================
        if (!isAdmin && profile.UserId !== user.id) {
            context.status = 403;
            result.error = new AccessViolation();
            return;
        }

        let options = Profile.getUpdateFields(isAdmin);
        yield profile.updateAttributes(data, options);

        profile = yield profile.reload();

        const resultdata = _.pick(profile.get({plain: true}), Profile.getVisibleFields(isAdmin));

        result.success = true;
        result.data.push(resultdata);
    }
}

