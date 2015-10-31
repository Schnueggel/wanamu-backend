'use strict';

import Setting from '../model/setting';
import ErrorUtil from '../util/error';
import _ from 'lodash';

export class SettingController {

    /**
     * ######################################################################################
     * ######################################################################################
     * Get the Settings by id. A user can only request his own settings. Except admins
     * ######################################################################################
     * ######################################################################################
     */
    *getSetting(id, next, context) {
        const user = context.req.user,
            isAdmin = user.isAdmin(),
            result = {
                error: null,
                success: false,
                data: []
            };

        context.body = result;

        let setting = yield Setting.findById(id);

        if (setting === null) {
            context.status = 404;
            result.error = new ErrorUtil.NotFound();
            return;
        }
        if (isAdmin === false && context.req.user.id !== setting.UserId) {
            context.status = 403;
            result.error = new ErrorUtil.AccessViolation();
            return;
        }

        result.success = true;

        const data = _.pick(setting.get({plain: true}), Setting.getVisibleFields(isAdmin));

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

        let setting = yield Setting.findById(id);

        if (setting === null) {
            context.status = 404;
            result.error = new ErrorUtil.NotFound();
            return;
        }

        // ==========================================================================
        // Only admin can update settings of other user
        // ==========================================================================
        if (isAdmin === false && setting.UserId !== user.id) {
            context.status = 403;
            result.error = new ErrorUtil.AccessViolation();
            return;
        }

        const options = Setting.getUpdateFields(isAdmin);
        yield setting.updateAttributes(data, options);

        setting = yield setting.reload();

        const resultdata = _.pick(setting.get({plain: true}), Setting.getVisibleFields(isAdmin));

        result.success = true;
        result.data.push(resultdata);
    }
}
