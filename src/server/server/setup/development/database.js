/**
 * Created by Christian on 5/10/2015.
 */
'use strict';

var User = require('../../model/user.js'),
    TodoList = require('../../model/todolist.js'),
    Todo = require('../../model/todo'),
    Profile = require('../../model/profile'),
    Setting = require('../../model/setting'),
    Registration = require('../../model/registration'),
    conf = require('../../config'),
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
    console.log('Setup');
    yield* createUsers();
    console.log('USER created');
    yield* createTodoList();
    console.log('TODOLIST created');
    yield* createTodos();
    console.log('TODO created');
}

function* createUsers() {
    var user = yield User.findOne({
        where: {
            email:conf.get('testmail1')
        }
    });

    var userdata =  {
        email: conf.get('testmail1'),
        password: 'abcdefghijk',
        confirmed : 1
    };

    var profiledata = {
        UserId : user.id,
        firstname: 'firstName',
        lastname: 'lastName',
        salutation: 'mr'
    };

    var settingdata = {
        UserId : user.id
    };

    var registrationdata = {
        UserId : user.id
    };

    if (!user) {
        user = yield User.create(userdata, { isNewRecord: true });
        yield Profile.create(profiledata, { isNewRecord: true });

        yield Setting.create( settingdata, { isNewRecord: true });

        yield Registration.create( registrationdata, { isNewRecord: true });
        console.log('user created');
    } else {
        yield user.updateAttributes( userdata );
        var profile = yield user.getProfile();
        yield profile.updateAttributes(profiledata);
        console.log('user updated');
    }


}

function* createTodoList() {



    var user = yield User.findOne({
        where:{
            email: conf.get('testmail1')
        }
    });

    var todolist = yield TodoList.findOne({
        where: {
            UserId: user.id
        }
    });

    if (!todolist) {
        var todolist = yield user.createTodoList({
            name: 'default'
        });
        yield user.setDefaultTodoList(todolist);
    }
}

function* createTodos() {
    var user = yield User.findOne({
        where:{
            email:conf.get('testmail1')
        }
    });

    var todolist = yield TodoList.findOne({where: {name: 'default', UserId: user.id}});

    var todos = todolist.findAll({
        where: {
            TodoListId: todolist.id
        }
    });

    if (todos.length === 0) {
        console.log('Create new todos');
        var todo1 = Todo.build({
            title: 'Make dog cake',
            repeat: true,
            repeatWeekly: ['mo', 'we'],
            alarm : new Date()
        });
        var todo2 = Todo.build({
            title: 'Make cat cake',
            repeat: true,
            repeatWeekly: ['mo', 'we'],
            alarm : new Date()
        });
        yield todo1.save();
        yield todo2.save();

        yield todolist.addTodos([todo1, todo2]);
    }
}

module.exports = start();
