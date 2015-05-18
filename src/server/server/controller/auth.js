/**
 * Created by Christian on 5/16/2015.
 */

var UsersCollection = require('../model/user.js'),
    Util = require('../util/util.js'),
    passport = require ('../config/passport.js'),
    co = require('co');

module.exports = {
    login: login,
    logout: logout
};

/**
 *  * Needs request.params.id field
 * @param req
 * @param res
 */
function* login(next) {
    var ctx = this
    yield* passport.authenticate('local', function*(err, user, info) {
        if (err) {
            throw err;
        }
        if (user === false) {
            ctx.status = 401
            ctx.body = { success: false };
        } else {
            yield ctx.login(user)
            ctx.body = { success: true };
        }
    }).call(this, next);
}

/**
 * Gets a single todolist
 * Needs request.params.id field
 * @param req
 * @param res
 */
function* logout(next) {
    this.logout();
    this.body = {
        success: true
    };
}
