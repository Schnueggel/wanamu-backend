'use strict';

let User = require('../../model/user.js'),
    TodoList = require('../../model/todolist.js'),
    Todo = require('../../model/todo'),
    Profile = require('../../model/profile'),
    Setting = require('../../model/setting'),
    Registration = require('../../model/registration'),
    conf = require('../../config'),
    co = require('co');



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

/**
 * Starts the database setup
 * @returns {Promise}
 */
function start() {
    return co(setup);
}

function* createUsers() {

    yield User.destroy({
        force: true,
        where: {
            id: {
                gt : 0
            }
        }
    });

    const userdata =  {
        email: conf.get('testmail1'),
        password: 'abcdefghijk',
        confirmed : 1
    };

    const userdata2 =  {
        email: conf.get('testmail2'),
        password: 'abcdefghijk',
        confirmed : 1
    };

    const profiledata = {
        firstname: 'firstName',
        lastname: 'lastName',
        salutation: 'mr'
    };

    const settingdata = { };

    const registrationdata = { };

    const user = yield User.create(userdata, { isNewRecord: true });
    const user2 = yield User.create(userdata2, { isNewRecord: true });

    profiledata.UserId = user.id;
    registrationdata.UserId = user.id;
    settingdata.UserId = user.id;
    yield Profile.create(profiledata, { isNewRecord: true });
    yield Setting.create( settingdata, { isNewRecord: true });
    yield Registration.create( registrationdata, { isNewRecord: true });

    profiledata.UserId = user2.id;
    registrationdata.UserId = user2.id;
    settingdata.UserId = user2.id;
    yield Profile.create(profiledata, { isNewRecord: true });
    yield Setting.create( settingdata, { isNewRecord: true });
    yield Registration.create( registrationdata, { isNewRecord: true });

    console.log('user created');
}

function* createTodoList() {



    let user = yield User.findOne({
        where:{
            email: conf.get('testmail1')
        }
    });

    let todolist = yield TodoList.findOne({
        where: {
            UserId: user.id
        }
    });

    if (!todolist) {
        let todolist = yield user.createTodoList({
            name: 'default'
        });
        yield user.setDefaultTodoList(todolist);
    }
}

function* createTodos() {
    let user = yield User.findOne({
        where:{
            email:conf.get('testmail1')
        }
    });

    let todolist = yield TodoList.findOne({where: {name: 'default', UserId: user.id}});

    let todos = yield Todo.findAll({
        where: {
            TodoListId: todolist.id
        }
    });

    if (todos.length === 0) {
        console.log('Create new todos');
        let todo1 = Todo.build({
            title: 'Make dog cake',
            repeat: true,
            repeatWeekly: ['mo', 'we'],
            alarm : new Date()
        });
        let todo2 = Todo.build({
            title: 'Make cat cake',
            repeat: true,
            repeatWeekly: ['mo', 'we'],
            alarm : new Date()
        });
        yield todo1.save();
        yield todo2.save();

        yield todolist.addTodos([todo1, todo2]);
    }
    else {
        for (let i = 0; i < todos.length; i++) {
            todos[i].finished = false;
            todos[i].deletedAt = null;
            yield todos[i].save();
        }
    }
}

module.exports = start();
