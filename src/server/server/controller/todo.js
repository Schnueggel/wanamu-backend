/**
 * Created by Christian on 5/17/2015.
 */

var TodoList = require('../model/todolist'),
    Todo = require('../model/todo'),
    ErrorUtil = require('../util/error');

function* create(){
    var input = this.request.body || {},
        result = {
            data: [],
            success: false,
            error: null
        },
        user = this.req.user,
        todolistname = input.todolistname || 'default',
        data = input.data || {},
        todo;

    var todolist = yield TodoList.findOne({where: { name: todolistname, UserId: user.id} });

    if (todolist === null) {
        result.error = new ErrorUtil.TodoListNotFound();
        this.body = result;
        return;
    }

    try {
        var options = {};
        // ==========================================================================
        // If user is not admin we allow him to update only certain fields
        // ==========================================================================
        if (user.group !== 'admin') {
            options = {fields: Todo.getUpdateableFields()};
        }

        todo = yield Todo.create(data, options);

        yield todolist.addTodo(todo);
        todo = yield todo.reload();
        result.success = true;
        result.data.push(todo.get({plain: true}));
    } catch (err) {
        console.error(err);
        if (err instanceof Todo.sequelize.ValidationError) {
            this.status = 422;
            result.error = err;
        } else {
            this.status = 500;
            result.error = new Error('Unable to create todo');
        }
    }

    this.body = result;
}

/**
 * Update Action
 * @param id
 */
function* update(id){
    var input = this.request.body || {},
        result = {
            data: [],
            success: false,
            error: null
        },
        user = this.req.user,
        todolist,
        data = input.data || {},
        todo;

    this.body = result;
    // ==========================================================================
    // Try to find the given todo
    // ==========================================================================
    var todo = yield Todo.findById(id);

    if (todo === null) {
        this.status = 404;
        result.error = new ErrorUtil.TodoNotFound();
        return;
    }

    var options = {};
    // ==========================================================================
    // If user is not admin we allow him to update only certain fields
    // ==========================================================================
    if (!user.isAdmin()) {
        options = {fields: Todo.getUpdateableFields()};
    }

    try {
        // ==========================================================================
        // Try to find the TodoList of this Todo_ to get the user
        // TODO We mainly need the userid here perhaps we should store it in the user model
        // ==========================================================================
        todolist = yield TodoList.findById(todo.TodoListId);

        // ==========================================================================
        // Check if user owns this todo
        // ==========================================================================
        if (!user.isAdmin() && (!user.id || todolist.UserId !== user.id)) {
            this.status = 403;
            result.error = new ErrorUtil.AccessViolation();
            return;
        }

        yield todo.updateAttributes(data, options );
        todo = yield todo.reload();
        result.success = true;
        result.data.push(todo.get({plain: true}));
    } catch (err) {
        console.error(err);
        if (err instanceof Todo.sequelize.ValidationError) {
            this.status = 422;
            result.error = err;
        } else {
            this.status = 500;
            result.error = new Error('Unable to create todo');
        }
    }
}

/**
 * Update Action
 * @param id
 */
function* deleteTodo(id){
    var input = this.request.body || {},
        result = {
            data: [],
            success: false,
            error: null
        },
        user = this.req.user,
        todolist,
        data = input.data || {},
        todo;

    this.body = result;

    // ==========================================================================
    // Try to find the given todo
    // ==========================================================================
    var todo = yield Todo.findById(id);

    if (todo === null) {
        this.status = 404;
        result.error = new ErrorUtil.TodoNotFound();
        return;
    }

    try {
        // ==========================================================================
        // Try to find the TodoList of this Todo_ to get the user
        // TODO We mainly need the userid here perhaps we should store it in the user model
        // ==========================================================================
        todolist = yield TodoList.findById(todo.TodoListId);

        // ==========================================================================
        // Check if user owns this todo
        // ==========================================================================
        if (!user.isAdmin() && (!user.id || todolist.UserId !== user.id)) {
            this.status = 403;
            result.error = new ErrorUtil.AccessViolation();
            return;
        }

        yield todo.destroy();
        result.success = true;
        return;
    } catch (err) {
        console.error(err);
        if (err instanceof Todo.sequelize.ValidationError) {
            this.status = 422;
            result.error = err;
        } else {
            this.status = 500;
            result.error = new Error('Unable to create todo');
        }
    }
}

module.exports = {
    delete: deleteTodo,
    update: update,
    create: create
};
