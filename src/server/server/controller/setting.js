'use strict';

let Setting = require('../model/setting'),
    ErrorUtil = require('../util/error'),
    _ = require('lodash');

export class SettingController {

    /**
     * ######################################################################################
     * ######################################################################################
     * Get the Settings by id. A user can only request his own settings. Except admins
     * ######################################################################################
     * ######################################################################################
     */
    *getSetting(id, next, context) {
        let user = context.req.user,
            isAdmin = user.isAdmin(),
            data,
            result = {
                error: null,
                success: false,
                data: []
            };

        context.body = result;

        let setting = yield Setting.findById(id);

        if (!setting) {
            context.status = 404;
            result.error = new ErrorUtil.NotFound();
            return;
        }
        if (!isAdmin && context.req.user.id !== setting.UserId) {
            context.status = 403;
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
    *updateSetting(id, next, context) {
        let user = context.req.user,
            isAdmin = user.isAdmin(),
            input = context.request.body || {},
            data = input.data || {},
            resultdata,
            result = {
                error: null,
                success: false,
                data: []
            };

        context.body = result;

        let setting = yield Setting.findById(id);

        if (!setting) {
            context.status = 404;
            result.error = new ErrorUtil.NotFound();
            return;
        }

        // ==========================================================================
        // Only admin can update settings of other user
        // ==========================================================================
        if (!isAdmin && setting.UserId !== user.id) {
            context.status = 403;
            result.error = new ErrorUtil.AccessViolation();
            return;
        }

        let options = Setting.getUpdateFields(isAdmin);
        yield setting.updateAttributes(data, options);

        setting = yield setting.reload();

        resultdata = _.pick(setting.get({plain: true}), Setting.getVisibleFields(isAdmin));

        result.success = true;
        result.data.push(resultdata);
    }
}
