'use strict';

var TodoList = require('../model/todolist'),
    User = require('../model/todolist'),
    ErrorUtil = require('../util/error'),
    co = require('co');

module.exports = {
    create: createUser,
    update: updateUser
};


/**
 * Gets a single todolist
 */
function* createUser() {
    var user = this.req.user,
        result = {
            error: null,
            success: false,
            data: []
        };

    this.body = result;
}

/**
 * Gets a single todolist
 */
function* updateUser(id) {
    var input = this.request.body || {},
        user = this.req.user,
        result = {
            count: 0,
            error: null,
            success: false,
            data: []
        };

    this.body = result;
}
