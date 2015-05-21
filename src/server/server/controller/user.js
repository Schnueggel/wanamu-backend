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
    get: getUser
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
        isAdmin = false,
        data = input.data || {};

    this.body = result;

    if (this.isAuthenticated() && this.req.user.isAdmin()) {
        isAdmin = true;
    }

    // ==========================================================================
    // Group can only be set by the admin
    // ==========================================================================
    if (!isAdmin) {
        data.group = 'user';
    }

    // ==========================================================================
    // Filter not allowed fields
    // ==========================================================================
    data = _.pick(data, User.getCreateFields(isAdmin));

    try {
        user = yield User.create(data);

        // ==========================================================================
        // Creating the default todolist.
        // Every User has one.
        // ==========================================================================
        todolist = yield TodoList.create({
            UserId: user.id,
            name: 'default'
        });

        yield user.addTodoList(todolist);

        user = yield user.reload({
            attributes: User.getVisibleFields(isAdmin)
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
 * Update a single User
 */
function* updateUser(id) {
    var input = this.request.body || {},
        result = {
            data: [],
            success: false,
            error: null
        },
        isAdmin = this.req.user.isAdmin(),
        visibleFields = User.getUpdateFields(isAdmin),
        user,
        data = input.data || {};

    this.body = result;

    data = _.pick(data, User.getUpdateFields());

    // ==========================================================================
    // Try to find the given user
    // ==========================================================================
    user = yield User.findById(id);

    if (user === null) {
        this.status = 404;
        result.error = new ErrorUtil.UserNotFound();
        return;
    }

    // ==========================================================================
    // Check user rights
    // ==========================================================================
    if (!isAdmin && this.req.user.id !== user.id) {
        this.status = 403;
        result.error = new ErrorUtil.AccessViolation();
        return;
    }

    // ==========================================================================
    // Create update options
    // ==========================================================================
    var options = {};

    // ==========================================================================
    // If no password is set we dont update it
    // ==========================================================================
    if (!data.password) {
        options.fields = _.without(User.getAttribKeys(), 'password');
    }

    try {
        yield user.updateAttributes(data, options);

        user = yield user.reload({
            attributes: visibleFields
        });

        user.password = undefined;

        result.success = true;
        result.data.push(user.get({plain: true}));
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
 * Gets a single user by his id
 */
function* getUser(id) {
    var user,
        data,
        isAdmin = this.req.user.isAdmin(),
        result = {
            count: 0,
            error: null,
            success: false,
            data: []
        };
    id = parseInt(id, 10);

    this.body = result;

    if (!isAdmin && this.req.user.id !== id) {
        this.status = 403;
        result.error = new ErrorUtil.AccessViolation();
        return;
    }

    // ==========================================================================
    // We include all todos and todolists on the user query
    // ==========================================================================
    var options = {
        where : {
            id : id
        },
        include: [
            {
                model: TodoList,
                include: [
                    {
                        model: Todo,
                        attributes: Todo.getVisibleFields(isAdmin)
                    }
                ],
                attributes: TodoList.getVisibleFields(isAdmin)
            }
        ],
        attributes : User.getVisibleFields(isAdmin)
    };

    // ==========================================================================
    // Non admins should not see banned users
    // ==========================================================================
    if (!isAdmin){
        options.banned = null;
    }

    user = yield User.findOne(options);

    if (!user || user.banned) {
        this.status = 404;
        result.error = new ErrorUtil.UserNotFound();
        return;
    }
    result.success = true;
    data = user.get({plain: true});
    result.data.push(data);
}
