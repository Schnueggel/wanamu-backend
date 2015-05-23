'use strict';

var TodoList = require('../model/todolist'),
    ErrorUtil = require('../util/error'),
    Todo = require('../model/todo'),
    co = require('co');

module.exports = {
    get : getTodolist,
    list : listTodolist,
    delete : deleteTodoList
};


/**
 * Gets a single todolist
 */
function* getTodolist(id) {
    var user = this.req.user,
        todolist,
        isAdmin = user.isAdmin(),
        resultdata,
        result = {
            error: null,
            success: false,
            data: []
        };

    this.body = result;

    todolist = yield TodoList.findById(id, {
        attributes: TodoList.getVisibleFields(),
        include: [{ all: true, nested: true }]
    });

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
    // ==========================================================================
    resultdata = _.pick(todolist.get({plain: true}), TodoList.getVisibleFields(isAdmin));

    result.success = true;
    result.data.push(resultdata);
}

/**
 * Gets a single todolist
 *
 * Can accept following input:
 * {
 *    userid: <int> //only by admins to select todolists from a user
 *    includetodos: <boolean, false> //if the true query will include todos off the selected todolists. Default: false
 * }
 */
function* listTodolist() {
    var input = this.request.body || {},
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
        limit: limit
    }, {
        raw: true,
        attributes: TodoList.getVisibleFields(),
        // ==========================================================================
        // TODO hide not visible Todo fields
        // ==========================================================================
        include: [{all: true, nested: true}]
    });

    if (!todolistresult) {
        this.status = 404;
        result.success = true;
        return;
    }

    result.data = todolistresult.rows;
    result.count = todolistresult.count;

    result.success = true;
}


/**
 * Delete Action
 * @param id
 */
function* deleteTodoList(id){
    var result = {
            data: [],
            success: false,
            error: null
        },
        user = this.req.user,
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

    try {
        // ==========================================================================
        // Check if user owns this todo
        // ==========================================================================
        if (!user.isAdmin() && (!user.id || todolist.UserId !== user.id)) {
            this.status = 403;
            result.error = new ErrorUtil.AccessViolation();
            return;
        }

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
