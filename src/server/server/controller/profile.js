'use strict';

let Profile = require('../model/profile'),
    ErrorUtil = require('../util/error'),
    _ = require('lodash');

/**
 * ######################################################################################
 * ######################################################################################
 * Get a Profile by id. A user can only request his own profile. Except admins
 * ######################################################################################
 * ######################################################################################
 */
function* getProfile(id) {
    let user = this.req.user,
        isAdmin = user.isAdmin(),
        data,
        result = {
            error: null,
            success: false,
            data: []
        };

    this.body = result;

    let profile = yield Profile.findById(id);

    if ( !profile ) {
        this.status = 404;
        result.error = new ErrorUtil.ProfileNotFound();
        return;
    }
    if (!isAdmin && this.req.user.id !== profile.UserId) {
        this.status = 403;
        result.error = new ErrorUtil.AccessViolation();
        return;
    }

    result.success = true;

    data = _.pick(profile.get({plain: true}), Profile.getVisibleFields(isAdmin));

    result.data.push(data);
}


/**
 * ######################################################################################
 * ######################################################################################
 * Updates a profile. Update is the only changing method for profile because it get created with
 * the user and cant exist without it
 * ######################################################################################
 * ######################################################################################
 */
function* updateProfile(id) {
    let user = this.req.user,
        isAdmin = user.isAdmin(),
        input = this.request.body || {},
        data = input.data || {},
        resultdata,
        result = {
            error: null,
            success: false,
            data: []
        };

    this.body = result;

    let profile = yield Profile.findById(id);

    if (!profile) {
        this.status = 404;
        result.error = new ErrorUtil.ProfileNotFound();
        return;
    }

    // ==========================================================================
    // Only admin can update profiles of other user
    // ==========================================================================
    if (!isAdmin && profile.UserId !== user.id) {
        this.status = 403;
        result.error = new ErrorUtil.AccessViolation();
        return;
    }

    let options = Profile.getUpdateFields(isAdmin);
    yield profile.updateAttributes(data, options);

    profile = yield profile.reload();

    resultdata = _.pick(profile.get({plain: true}), Profile.getVisibleFields(isAdmin));

    result.success = true;
    result.data.push(resultdata);
}


module.exports = {
    update : updateProfile,
    get : getProfile
};
