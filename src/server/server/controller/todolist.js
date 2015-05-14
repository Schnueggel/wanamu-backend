'use strict';

var TodoListModel = require('../model/todolist.js'),
    Util = require('../util/util.js'),
    co = require('co');

module.exports = {
    update: co.wrap(updateTodolist),
    get: co.wrap(getTodolist)
};

/**
 *  * Needs request.params.id field
 * @param req
 * @param res
 */
function* updateTodolist(req, res) {
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
function* getTodolist(req, res) {
    yield null;
}

