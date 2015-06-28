'use strict';

var TodoList = require('../model/todolist'),
    User = require('../model/user'),
    Todo = require('../model/todo'),
    Setting = require('../model/setting'),
    Profile = require('../model/profile'),
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
        resultdata,
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

    var transaction = yield User.sequelize.transaction({isolationLevel: 'READ COMMITTED' });

    try {

        user = yield User.create(data, {transaction: transaction});

        // ==========================================================================
        // Creating the default todolist.
        // Every User has one.
        // ==========================================================================
        todolist = yield TodoList.create({
            UserId: user.id,
            name: 'default'
        }, {transaction: transaction});


        yield user.setDefaultTodoList(todolist, {transaction: transaction});

        var settingdata = _.pick(data.Setting || {}, Setting.getCreateFields(isAdmin));
        settingdata.UserId = user.id;
        yield Setting.create( settingdata, { isNewRecord: true, transaction: transaction } );

        var profiledata = _.pick(data.Profile || {}, Profile.getCreateFields(isAdmin));
        profiledata.UserId = user.id;

        yield Profile.create( profiledata,{ isNewRecord: true, transaction: transaction } );

        yield user.addTodoList(todolist, {transaction: transaction});

        transaction.commit();

        user = yield user.reload({
            include: User.getIncludeAllOption(false)
        });

        result.success = true;
        // ==========================================================================
        // Filter the resulting data
        // Only visible fields will be sent to the user
        // ==========================================================================
        resultdata = user.getVisibleData();

        result.data.push(resultdata);

    } catch (err) {
        console.error(err.stack);
        transaction.rollback();
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
        user,
        resultdata,
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
            include: User.getIncludeAllOption(isAdmin)
        });

        // ==========================================================================
        // Filter the resulting data
        // Only visible fields will be sent to the user
        // ==========================================================================
        resultdata = user.getVisibleData();

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
 * Gets a single user by his id
 * If id === 'current' it returns the current authed user
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

    if (id === 0) {
        id = this.req.user.id;
    }

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
        include: User.getIncludeAllOption(isAdmin),
        attributes : User.getVisibleFields(isAdmin)
    };

    // ==========================================================================
    // Non admins should not see banned users
    // ==========================================================================
    if (!isAdmin){
        options.where.banned = null;
    }

    user = yield User.findOne(options);

    if (!user) {
        this.status = 404;
        result.error = new ErrorUtil.UserNotFound();
        return;
    }
    result.success = true;

    data = user.getVisibleData();
    result.data.push(data);
}
