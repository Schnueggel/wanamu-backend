'use strict';

const passport = require('../config/passport.js'),
    ErrorUtil = require('../util/error');

export class AuthController {

    /**
     * #########################################################################################################
     * Handle the result of the passport local strategy
     * #########################################################################################################
     * @param {Error} err
     * @param user
     * @param {Object} context Koa Request Context
     */
    *authenticateLocal(err, user, context) {
        if (err instanceof ErrorUtil.NotConfirmed) {
            context.status = 424;
            context.body = {
                success: false
            };
        } else if (typeof user !== 'object') {
            // ==========================================================================
            // 401 for not Authenticated
            // ==========================================================================
            context.status = 401;
            context.body = {
                success: false
            };
        } else {
            yield context.login(user);
            context.body = {
                success: true,
                data: [user.getVisibleData()]
            };
        }
    }

    /**
     *
     * @param {Function} next
     * @param {Object} context Koa Request Context
     */
    *login(next, context) {
        let that = this;
        yield passport.authenticate('local', function*(err, user) {
            yield that.authenticateLocal(err, user, context);
        });
    }

    /**
     * @param {Function} next
     * @param {Object} context Koa Request Context
     */
    *doLogout(next, context) {
        context.logOut();
        context.body = {
            success: true,
            data: []
        };
    }
}

