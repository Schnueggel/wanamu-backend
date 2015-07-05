'use strict';

var User = require('../model/user'),
    Registration = require('../model/registration'),
    Profile = require('../model/profile'),
    mailService = require('../services/mail'),
    ErrorUtil = require('../util/error');

/**
 * ######################################################################################
 * ######################################################################################
 * Get a Profile by id. A user can only request his own profile. Except admins
 * ######################################################################################
 * ######################################################################################
 */
function* confirmRegistration(hash) {
    var user,
        result = {
            error: null,
            success: false,
            data: []
        };

    this.body = result;

    user = yield User.findOne({
        include : [
            {
                model : Profile
            },
            {
                model : Registration,
                where : {
                    confirmhash: hash
                }
            }
        ]
    });

    if ( !user ) {
        this.status = 404;
        result.error = new ErrorUtil.NotFound();
        return;
    }

    if ( !user.confirmed ) {
        yield user.updateAttributes({
            confirmed: 1
        });
        yield user.Registration.updateAttributes({
            lastconfirmation: user.sequelize.fn('NOW')
        });
        mailService.sendConfirmationSuccessMail(user.email, user.Profile);
    }

    result.success = true;
}


/**
 * ######################################################################################
 * ######################################################################################
 * Updates a profile. Update is the only changing method for profile because it get created with
 * the user and cant exist without it
 * ######################################################################################
 * ######################################################################################
 */
function* resendConfirmation() {
    var user = this.req.user,
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

    var profile = yield Profile.findById(id);

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

    var options = Profile.getUpdateFields(isAdmin);
    yield profile.updateAttributes(data, options);

    profile = yield profile.reload();

    resultdata = _.pick(profile.get({plain: true}), Profile.getVisibleFields(isAdmin));

    result.success = true;
    result.data.push(resultdata);
}


module.exports = {
    confirm : confirmRegistration,
    resend : resendConfirmation
};
