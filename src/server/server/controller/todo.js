/**
 * Created by Christian on 5/17/2015.
 */

let TodoList = require('../model/todolist'),
    Todo = require('../model/todo'),
    ErrorUtil = require('../util/error'),
    _ = require('lodash');


module.exports = {
    delete: deleteTodo,
    update: update,
    create: create
};

/**
 * Create Action
 */
function* create() {
    let input = this.request.body || {},
        result = {
            data: [],
            success: false,
            error: null
        },
        user = this.req.user,
        isAdmin = user.isAdmin(),
        options = {},
        data = input.data || {},
        todolistid = data.TodoListId || '',
        resultdata,
        queryOptions = {where: {id: todolistid}},
        todo;

    // ==========================================================================
    // Filter data
    // TODO check how the Model react to different case of fieldnames
    // ==========================================================================
    data = _.pick(data, Todo.getCreateFields(isAdmin));

    this.body = result;

    if (!_.isNumber(todolistid)) {
        this.status = 422;
        console.error('Todolist id is not a number: ' + todolistid);
        result.error = new ErrorUtil.TodoListNotFound();
        return;
    }

    // ==========================================================================
    // Admin can create todos on every todolist
    // ==========================================================================
    if (!isAdmin) {
        queryOptions.where.UserId = user.id;
    }

    // ==========================================================================
    // Todos always belongs to a todolist lets find this
    // ==========================================================================
    let todolist = yield TodoList.findOne(queryOptions);

    if (todolist === null) {
        this.status = 404;
        result.error = new ErrorUtil.TodoListNotFound();
        return;
    }

    try {
        options = {fields: Todo.getUpdateFields(isAdmin)};

        todo = yield Todo.create(data, options);

        todo = yield todo.reload();
        result.success = true;

        // ==========================================================================
        // Filter the resulting data
        // Only visible fields will be sent to the user
        // ==========================================================================
        resultdata = _.pick(todo.get({plain: true}), Todo.getVisibleFields(isAdmin));
        result.data.push(resultdata);
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
function* update(id) {
    let input = this.request.body || {},
        result = {
            data: [],
            success: false,
            error: null
        },
        user = this.req.user,
        isAdmin = user.isAdmin(),
        todolist,
        options,
        resultdata,
        data = input.data || {},
        todo;

    this.body = result;
    // ==========================================================================
    // Try to find the given Todo_
    // ==========================================================================
    todo = yield Todo.findById(id);

    if (todo === null) {
        this.status = 404;
        result.error = new ErrorUtil.TodoNotFound();
        return;
    }

    // ==========================================================================
    // Filter input data
    // ==========================================================================
    data = _.pick(data, Todo.getUpdateFields(isAdmin));

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

        // ==========================================================================
        // Set the Query options
        // ==========================================================================
        options = {fields: Todo.getUpdateFields(isAdmin)};

        yield todo.updateAttributes(data, options);
        // ==========================================================================
        // Reload the data to get the values of generated fields like updated aso.
        // ==========================================================================
        todo = yield todo.reload();
        // ==========================================================================
        // Filter the resulting data
        // Only visible fields will be sent to the user
        // ==========================================================================
        resultdata = _.pick(todo.get({plain: true}), Todo.getVisibleFields(isAdmin));

        result.success = true;

        result.data.push(resultdata);

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
 * Delete Action
 * @param id
 */
function* deleteTodo(id) {
    let result = {
            data: [],
            success: false,
            error: null
        },
        user = this.req.user,
        isAdmin = user.isAdmin(),
        todolist,
        todo;

    this.body = result;

    // ==========================================================================
    // Try to find the given todo
    // ==========================================================================
    todo = yield Todo.findById(id);

    if (todo === null) {
        this.status = 404;
        result.error = new ErrorUtil.TodoNotFound();
        return;
    }

    try {
        // ==========================================================================
        // Try to find the TodoList of this Todo_ to get the user
        // TODO We mainly need the userid here perhaps we should store it in the TodoModel
        // ==========================================================================
        todolist = yield TodoList.findById(todo.TodoListId);

        // ==========================================================================
        // Check if user owns this todo
        // ==========================================================================
        if (!user.isAdmin() && todolist.UserId !== user.id) {
            this.status = 403;
            result.error = new ErrorUtil.AccessViolation();
            return;
        }

        yield todo.destroy();

        todo = yield todo.reload({
            paranoid: false
        });
        // ==========================================================================
        // Filter the resulting data
        // Only visible fields will be sent to the user
        // ==========================================================================
        let resultdata = _.pick(todo.get({plain: true}), Todo.getVisibleFields(isAdmin));

        result.success = true;
        result.data.push(resultdata);

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
