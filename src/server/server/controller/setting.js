'use strict';

var Setting = require('../model/setting'),
    ErrorUtil = require('../util/error');

/**
 * ######################################################################################
 * ######################################################################################
 * Get the Settings by id. A user can only request his own settings. Except admins
 * ######################################################################################
 * ######################################################################################
 */
function* getSetting(id) {
    var user = this.req.user,
        isAdmin = user.isAdmin(),
        data,
        result = {
            error: null,
            success: false,
            data: []
        };

    this.body = result;

    var setting = yield Setting.findById(id);

    if ( !setting ) {
        this.status = 404;
        result.error = new ErrorUtil.NotFound();
        return;
    }
    if (!isAdmin && this.req.user.id !== setting.UserId) {
        this.status = 403;
        result.error = new ErrorUtil.AccessViolation();
        return;
    }

    result.success = true;

    data = _.pick(setting.get({plain: true}), Setting.getVisibleFields(isAdmin));

    result.data.push(data);
}


/**
 * ######################################################################################
 * ######################################################################################
 * Updates a setting. Update is the only changing method for setting because it get created with
 * the user and cant exist without it
 * ######################################################################################
 * ######################################################################################
 */
function* updateSetting(id) {
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

    var setting = yield Setting.findById(id);

    if (!setting) {
        this.status = 404;
        result.error = new ErrorUtil.NotFound();
        return;
    }

    // ==========================================================================
    // Only admin can update settings of other user
    // ==========================================================================
    if (!isAdmin && setting.UserId !== user.id) {
        this.status = 403;
        result.error = new ErrorUtil.AccessViolation();
        return;
    }

    var options = Setting.getUpdateFields(isAdmin);
    yield setting.updateAttributes(data, options);

    setting = yield setting.reload();

    resultdata = _.pick(setting.get({plain: true}), Setting.getVisibleFields(isAdmin));

    result.success = true;
    result.data.push(resultdata);
}


module.exports = {
    update : updateSetting,
    get : getSetting
};
