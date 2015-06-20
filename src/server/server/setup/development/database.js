/**
 * Created by Christian on 5/10/2015.
 */
'use strict';

var User = require('../../model/user.js'),
    TodoList = require('../../model/todolist.js'),
    Todo = require('../../model/todo'),
    Setting = require('../../model/setting'),
    co = require('co');

/**
 * Starts the database setup
 * @returns {Promise}
 */
function start() {
    return co(setup);
}

/**
 * Setup complete database
 */
function* setup(){
    yield* createUsers();
    yield* createTodoList();
    yield* createTodos();
    console.log('data created');
}


function* createUsers() {
    var user = yield User.create({
        email: 'test@email.de',
        firstname: 'firstName',
        lastname: 'lastName',
        password: 'abcdefghijk',
        salutation: 'mr'
    }, { isNewRecord: true });

    var settings = yield Setting.create({
        UserId : user.id
    }, { isNewRecord: true });
}

function* createTodoList() {
    var user = yield User.findOne({where:{email:'test@email.de'}});

    var todolist = yield user.createTodoList({
        name: 'default'
    });

    yield user.setDefaultTodoList(todolist);
}

function* createTodos() {
    var user = yield User.findOne({where:{email:'test@email.de'}});

    var todolist = yield TodoList.findOne({where: {name: 'default', UserId: user.id}});

    var todo1 = Todo.build({
        title: 'Make dog cake'
    });
    var todo2 = Todo.build({
        title: 'Make cat cake'
    });
    yield todo1.save();
    yield todo2.save();

    yield todolist.addTodos([todo1, todo2]);
}

module.exports = start();
