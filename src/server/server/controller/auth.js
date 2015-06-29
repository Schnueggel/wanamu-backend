/**
 * Created by Christian on 5/16/2015.
 */

var UsersCollection = require('../model/user.js'),
    Util = require('../util/util.js'),
    passport = require ('../config/passport.js'),
    _ = require('lodash'),
    co = require('co');

module.exports = {
    login: login,
    dologout: dologout
};

/**
 *  * Needs request.params.id field
 * @param req
 * @param res
 */
function* login(next) {
    var ctx = this;
    yield* passport.authenticate('local', function*(err, user, info) {
        if (err) {
            throw err;
        }
        if (typeof user !== 'object') {
            // ==========================================================================
            // 401 for not Authenticated
            // ==========================================================================
            ctx.status = 401;
            ctx.body = {
                success: false
            };
        } else {
            yield ctx.login(user);
            ctx.body = {
                success: true,
                data: [user.getVisibleData()]
            };
        }
    }).call(this, next);
}

/**
 * Logs the user out
 * @param next
 */
function* dologout(next) {
    this.logOut();
    this.body = {
        success: true,
        data: []
    };
}
