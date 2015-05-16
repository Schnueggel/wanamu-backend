/**
 * Created by Christian on 5/16/2015.
 */

var UsersCollection = require('../model/user.js'),
    Util = require('../util/util.js'),
    co = require('co');

module.exports = {
    update: updateTodolist,
    get: getTodolist
};

/**
 *  * Needs request.params.id field
 * @param req
 * @param res
 */
function* login(req, res) {
    var user = req.user,
        input = req.body || {};
    yield null;
}

/**
 * Gets a single todolist
 * Needs request.params.id field
 * @param req
 * @param res
 */
function* logout(req, res) {
    yield null;
}
