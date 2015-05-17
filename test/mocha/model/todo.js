'use strict';
/**
 * Created by Christian on 5/6/2015.
 */
var assert = require('assert'),
    mongo = require('../../../dist/server/server/config/mongo.js'),
    Todo = require('../../../dist/server/server/model/todo.js'),
    User =  require('../../../dist/server/server/model/user.js'),
    ErrorUtil = require('../../../dist/server/server/util/error.js'),
    co = require('co');


describe('Test Todo Model', function () {

    it('Should create Todo', function (done) {
        assert.equal(typeof Todo, 'object');
        assert.equal(typeof User, 'object');
        assert.equal(typeof Todo.Todo, 'function');

        co(testCreateTodo).then(function(){
            done();
        }).catch(function(err){
            console.error(err);
            done(err);
        });
    });
});


function* testCreateTodo(){

    var user = yield User.findOne({ email: 'test@email.de' });

    assert(typeof user, 'object');
    assert(typeof User.defaultTodoListName, 'string');

    var todo = yield Todo.create(user._id, User.defaultTodoListName, {
        title: 'TestTodo'
    });

    assert(typeof todo, 'object');

    try {
        yield Todo.create(user._id, 'not a todolist', {
            title: 'TestTodo'
        });
        assert(false, 'We should not reach this code');
    } catch(err) {
        assert(err instanceof ErrorUtil.TodoListNotFound);
    }

    try {
        yield Todo.create('xxx', 'not a todolist', {
            title: 'TestTodo'
        });
        assert(false, 'We should not reach this code');
    } catch(err) {
        assert(err instanceof ErrorUtil.UserNotFound);
    }
}
