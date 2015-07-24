'use strict';

let TodoList = require('../model/todolist'),
    ErrorUtil = require('../util/error'),
    _ = require('lodash'),
    Todo = require('../model/todo');

/**
 * TODO implement
 */
function* createTodolist() {
    throw new Error('Not Implemented yet');
}

/**
 * Gets a single todolist
 */
function* getTodolist(id) {
    let user = this.req.user,
        todolist,
        isAdmin = user.isAdmin(),
        resultdata,
        todolistVisibleFields = TodoList.getVisibleFields(isAdmin),
        result = {
            error: null,
            success: false,
            data: []
        };

    this.body = result;

    if (id === 'default') {
        todolist = yield TodoList.findOne({
            where : {
                UserId: user.id,
                type: id
            },
            attributes: todolistVisibleFields,
            include: [{ model: Todo, attributes: Todo.getVisibleFields(isAdmin)}]
        });
    } else {
        todolist = yield TodoList.findById(id, {
            attributes: todolistVisibleFields,
            include: [{ model: Todo, attributes: Todo.getVisibleFields(isAdmin)}]
        });
    }


    if (!todolist) {
        this.status = 404;
        result.error = new ErrorUtil.TodoListNotFound();
        return;
    }

    if (!isAdmin && todolist.UserId !== user.id) {
        this.status = 403;
        result.error = new ErrorUtil.AccessViolation();
        return;
    }

    // ==========================================================================
    // Filter the output data
    // We have to add the virtual fields Todos to the list. Else Todos will not be
    // included. Because its not a normal attribute of the TodoList model.
    // ==========================================================================
    todolistVisibleFields.push('Todos');
    resultdata = _.pick(todolist.get({plain: true}), todolistVisibleFields);

    result.success = true;
    result.data.push(resultdata);
}

/**
 * Gets a single todolist
 *
 * Can accept following input:
 *
 * ```js
 * {
 *    userid: <int> //only by admins to select todolists from a user
 *    includetodos: <boolean, false> //if the true query will include todos off the selected todolists. Default: false
 * }
 * ```
 */
function* listTodolist() {
    let input = this.request.body || {},
        limit = input.limit || 100,
        offset = input.offset || 0,
        user = this.req.user,
        todolistresult,
        isAdmin = user.isAdmin(),
        include  = [],
        id = user.id,
        result = {
            count: 0,
            error: null,
            success: false,
            data: []
        };

    this.body = result;

    // ==========================================================================
    // If is admin and userid is set we select those todolists
    // ==========================================================================
    if (isAdmin && input.userid) {
        id = input.userid;
    }

    if (input.includetodos === true) {
        include = [{model: Todo, attributes: Todo.getVisibleFields(isAdmin)}];
    }
    todolistresult = yield TodoList.findAndCountAll({
        where: {
            UserId: id
        },
        offset: offset,
        limit: limit,
        include : include,
        attributes: TodoList.getVisibleFields(isAdmin),
        raw: true
    });

    if (!todolistresult) {
        return;
    }

    result.data = todolistresult.rows;
    result.count = todolistresult.count;

    result.success = true;
}


/**
 * Delete Action
 *
 * Sends the folling errors:
 *
 * Error.TodoListNotFound, 404
 * Error.TodoListDefaultNoDelete 403
 * Error.AccessViolation 403
 * Error.ValidationError 422
 * Error 500
 *
 * @param {int} id
 */
function* deleteTodoList(id){
    let result = {
            data: [],
            success: false,
            error: null
        },
        user = this.req.user,
        isAdmin = user.isAdmin(),
        todolist;

    this.body = result;

    // ==========================================================================
    // Try to find the given todo
    // ==========================================================================
    todolist = yield TodoList.findById(id);

    if (todolist === null) {
        this.status = 404;
        result.error = new ErrorUtil.TodoListNotFound();
        return;
    }


    if (todolist.isDefault()) {
        this.status = 403;
        result.error = new ErrorUtil.TodoListDefaultNoDelete();
        return;
    }

    // ==========================================================================
    // Check if user owns this todo
    // ==========================================================================
    if (!isAdmin && todolist.UserId !== user.id) {
        this.status = 403;
        result.error = new ErrorUtil.AccessViolation();
        return;
    }

    try {
        yield todolist.destroy();
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
    get : getTodolist,
    list : listTodolist,
    delete : deleteTodoList,
    create : createTodolist
};
