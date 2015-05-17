/**
 * Created by Christian on 5/17/2015.
 */

var TodoCollection = require('../model/todo.js'),
    ErrorUtil = require('../util/error.js'),
    co = require('co');

function* create(userid, todolist){
    var input = this.request.body || {},
        result = {
            data: [],
            error: null
        }
    try {
        var todo = yield TodoCollection.create(userid, todolist, input);
        result.data.push(todo);
    } catch (err) {
        if (err instanceof ErrorUtil.ModelValidationError) {
            this.status = 422;
            result.error = err;
        } else if (err instanceof  ErrorUtil.UserNotFound) {
            result.error = err;
        } else {
            result.error = new Error('Unable to create todolist');
        }
    }
    this.body = result;
}


module.exports = {
    create: create
};
