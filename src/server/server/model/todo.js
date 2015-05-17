/**
 * Created by Christian on 5/17/2015.
 */

var User = require('./user.js'),
    ErrorUtil = require('../util/error.js'),
    TodoList = require('./todolist.js');

/**
 * TodoClass
 * @param {String} title
 * @param {Object} [options]
 * @constructor
 */
var Todo = function(options) {
    var data = options || {};
    this.title = data.title || null;
    this.color = data.color || null;
    this.created = data.created || Date.now();
};

Todo.prototype.title = null;
Todo.prototype.color = null;
Todo.prototype._id = null;

var todo;

module.exports = todo = {
    Todo: Todo, /**
     *
     * Creates a new TodoObject
     * @param {String} userid
     * @param {String} todolist
     * @param {Object} data
     * @throws TodoListNotFound, UserNotFound
     */
    create: function* (userid, todolistid, data) {
        var user = null;
        try {
            user = yield User.findById(userid);
        } catch (err) {
            if (err.name === 'MongoError') {
                throw err;
            }
            console.error(err);
        }


        if (user === null) {
            throw new ErrorUtil.UserNotFound();
        }

        if (!user.todolists || !user.todolists[todolistid]) {
            throw new ErrorUtil.TodoListNotFound();
        }

        var todolist = user.todolists[todolistid];


        data = filterTodo(data);

        validateTodo(data);

        var todo = new Todo(data);
        todo._id = User.id();

        todolist.todos.push(todo);

        user = yield User.findAndModify({ _id: userid }, { $set: {
            todolists : user.todolists
        }});
        console.log(user);
        return yield User.findOne(userid);

    }
};

function filterTodo (input) {
    var data = input || {};

    delete data._id;
    delete data.created;

    return data;
}

function validateTodo (input) {
    var data = input || {};
    var err = [];
    if (!data.title) {
        err.push(new ErrorUtil.ModelValidationFieldError('title','Field cannot be empty'));
    }

    if (err.length > 0 ) {
        throw new ErrorUtil.ModelValidationError(null, err, 'Todo');
    }
}
