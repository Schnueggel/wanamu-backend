'use strict';

var TodoList = require('../model/todolist'),
    User = require('../model/user'),
    Todo = require('../model/todo'),
    Setting = require('../model/setting'),
    Profile = require('../model/profile'),
    Registration = require('../model/registration'),
    mailService = require('../services/mail'),
    ErrorUtil = require('../util/error'),
    bcrypt = require ('bcryptjs'),
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
 * Create a new User. The given userdata must contain a field Profile with firstname, lastname
 * and salutation
 * ######################################################################################
 * ######################################################################################
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

    // ==========================================================================
    // A logged in user cannot create a new user only Admin can do this
    // ==========================================================================
    if (this.isAuthenticated() && !this.req.user.isAdmin()) {
        this.status = 403;
        result.error = new ErrorUtil.AccessViolation('Please logout before creating a new User');
        return;
    }
    // ==========================================================================
    // Group can only be set by the admin
    // ==========================================================================
    if (!isAdmin) {
        data.group = 'user';
    }
    var salt = bcrypt.genSaltSync(10);
    // ==========================================================================
    // Filter not allowed fields
    // ==========================================================================
    var userdata = _.pick(data, User.getCreateFields(isAdmin));

    // ==========================================================================
    // We create the user with in an transaction because many sub tasks occur
    // ==========================================================================
    var transaction = yield User.sequelize.transaction({isolationLevel: 'READ COMMITTED' });

    try {
        user = yield User.create(userdata, {transaction: transaction});

        // ==========================================================================
        // Creating the default todolist.
        // Every User has one.
        // ==========================================================================
        todolist = yield TodoList.create({
            UserId: user.id,
            name: 'default'
        }, {transaction: transaction});

        yield user.setDefaultTodoList(todolist, {transaction: transaction});
        // ==========================================================================
        // On creation time of user setting data is not needed but a related model will be created
        // ==========================================================================
        var settingdata = _.pick(data.Setting || {}, Setting.getCreateFields(isAdmin));
        settingdata.UserId = user.id;
        yield Setting.create( settingdata, { isNewRecord: true, transaction: transaction } );
        // ==========================================================================
        // On creation time of User Profile data is necessary
        // ==========================================================================
        var profiledata = _.pick(data.Profile || {}, Profile.getCreateFields(isAdmin));
        profiledata.UserId = user.id;

        yield Profile.create( profiledata,{ isNewRecord: true, transaction: transaction } );

        var registration = yield Registration.create ( {
            UserId : user.id
        }, { isNewRecord: true, transaction: transaction });

        // ==========================================================================
        // Default todolist is needed
        // ==========================================================================
        yield user.addTodoList(todolist, {transaction: transaction});

        transaction.commit();
        // ==========================================================================
        // Reload the user data to get all autocreated values like updatedAt
        // ==========================================================================
        user = yield user.reload({
            include: User.getIncludeAllOption(false)
        });

        yield mailService.sendConfirmationMail(user, registration);

        result.success = true;
        // ==========================================================================
        // Filter the resulting data
        // Only visible fields will be sent to the user
        // ==========================================================================
        resultdata = user.getVisibleData();

        result.data.push(resultdata);

    } catch (err) {
        console.error(err.stack);
        if (transaction.finished !== 'commit') {
            transaction.rollback();
        }
        // ==========================================================================
        // TODO test validation errors
        // ==========================================================================
        if (err instanceof User.sequelize.ValidationError) {
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
    // If no password is set we don't update it
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
 * ######################################################################################
 * ######################################################################################
 * Gets a single user by his id
 * If id === 0 it returns the current authed user
 * ######################################################################################
 * ######################################################################################
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
