'use strict';

var TodoList = require('../model/todolist'),
    User = require('../model/user'),
    Todo = require('../model/todo'),
    ErrorUtil = require('../util/error'),
    _ = require('lodash'),
    co = require('co');

module.exports = {
    // ==========================================================================
    // actions
    // ==========================================================================
    create: createUser,
    update: updateUser,
    get: getUser,
    // ==========================================================================
    // Helper functions
    // ==========================================================================
    filterOptions: filterOptions
};

/**
 * ######################################################################################
 * ######################################################################################
 * ACTIONS
 * ######################################################################################
 * ######################################################################################
 */

/**
 * Gets a single todolist
 */
function* createUser() {
    var input = this.request.body || {},
        result = {
            data: [],
            success: false,
            error: null
        },
        user,
        todolist,
        data = input.data || {};

    this.body = result;
    console.log(data);
    // ==========================================================================
    // Filter not allowed fields
    // ==========================================================================
    data = _.pick(data, User.getCreateFields());

    // ==========================================================================
    // Group can only be set by the admin
    // ==========================================================================
    if (!this.isAuthenticated() || !this.req.user.isAdmin()) {
        data.group = 'user';
    }

    try {
        user = yield User.create(data);

        // ==========================================================================
        // Creating the default todolist
        // ==========================================================================
        todolist = yield TodoList.create({
            UserId: user.id,
            name: 'default'
        });

        yield user.addTodoList(todolist);

        user = yield user.reload({
            attributes: User.getVisibleFields()
        });

        result.success = true;
        result.data.push(user.get({plain: true}));
    } catch (err) {
        console.error(err);
        if (err instanceof Todo.sequelize.ValidationError) {
            this.status = 422;
            result.error = err;
        } else {
            this.status = 500;
            result.error = new Error('Unable to create User.');
        }
    }
}

/**
 * Gets a single todolist
 */
function* updateUser(id) {
    var input = this.request.body || {},
        user = this.req.user,
        result = {
            count: 0,
            error: null,
            success: false,
            data: []
        };

    this.body = result;
}


/**
 * Gets a single user by his id
 */
function* getUser(id) {
    var id = parseInt(id, 10),
        user,
        data,
        result = {
            count: 0,
            error: null,
            success: false,
            data: []
        };

    this.body = result;

    if (!this.req.user.isAdmin() && this.req.user.id !== id) {
        this.status = 403;
        result.error = new ErrorUtil.AccessViolation();
        return;
    }

    var options = filterOptions(this.req.user.isAdmin(), true, true);
    options.where = {
        id : id,
        banned : null
    };
    user = yield User.findOne(options);

    if (!user || user.banned) {
        this.status = 404;
        result.error = new ErrorUtil.UserNotFound();
        return;
    }

    data = user.get({plain: true});
    result.data = data;
}

/**
 * ######################################################################################
 * ######################################################################################
 * Helper functions
 * ######################################################################################
 * ######################################################################################
 */

/**
 * Creates query options for the User model
 * @param {boolean} isAdmin set true if owner of the query is an admin
 * @param {boolean} todolists include todolist in the result
 * @param {boloean} todos include todods in the todolist. Only possible when todolists is true
 * @returns {options|{schema, schemaDelimiter}|{}|*}
 */
function filterOptions(isAdmin, todolists, todos) {
    var options = {
        include:[]
    };

    if (!isAdmin) {
        options.attributes = User.getVisibleFields();
    } else {
        // ==========================================================================
        // We remove the password in any case
        // ==========================================================================
        options.attributes = _.without(_.keys(User.attributes), 'password');
    }

    // ==========================================================================
    // TodoListModel query options
    // ==========================================================================
    if (todolists) {
        var todolistoptions = {
            model: TodoList,
            include: []
        };
        if (!isAdmin) {
            todolistoptions.attributes = TodoList.getVisibleFields();
        }
        options.include.push(todolistoptions);

        // ==========================================================================
        // TodoModel query options
        // Only possible if todolists is true
        // ==========================================================================
        if (todos) {
            var todooptions = {
                model: Todo
            };
            if (!isAdmin) {
                todooptions.attributes = Todo.getVisibleFields();
            }
            todolistoptions.include.push(todooptions);
        }
    }

    return options;
}
