/**
 * Created by Christian on 5/15/2015.
 */

var mongo = require('../config/mongo.js'),
    bcrypt = require('../config/bcrypt.js'),
    co = require('co'),
    todolist = require('../model/todolist.js'),
    ErrorUtil = require('../util/error.js'),
    wrap = require('co-monk');

var monkcoll =  mongo.get('users');
var User = wrap(monkcoll);

User.index('email', { unique: true });

/**
 * ######################################################################################
 * ######################################################################################
 * CUSTOM EXTENSIONS
 * ######################################################################################
 * ######################################################################################
 */
User.SALUTATION_MR = 'mr';
User.SALUTATION_MRS = 'mrs';
User.salutations = [User.SALUTATION_MR, User.SALUTATION_MRS];
User.defaultTodoListName = 'default';


/**
 * Creates a new user
 * @param {Object} input
 * @returns {*}
 */
User.create = function* (input) {
    var data = input || {};

    validateData(data);

    data.password = yield bcrypt.hashAndSalt(data.password);

    if (!data.password && data.password.length !== 60) {
        throw new ErrorUtil.UserPasswordNotCreated();
    }

    data.todolists = {};
    var tdlist = new todolist.TodoList(User.defaultTodoListName);
    data.todolists[User.defaultTodoListName] = tdlist;

    try {
        var user = yield User.insert(data);
    } catch (err) {
        if (err.name === 'MongoError' && err.code === 11000) {
            throw new ErrorUtil.UserAlreadyExists();
        }
        throw err;
    }

    return user;
};

/**
 * ######################################################################################
 * ######################################################################################
 * HELPER FUNCTIONS
 * ######################################################################################
 * ######################################################################################
 */
function validateData(data) {

    var err = []

    if (!data.password) {
        err.push({field: 'password', message: 'Field cannot be empty'});
    } else if (data.password.length < 8) {
        err.push({field: 'password', message: 'Min length 8'});
    }

    if (!data.firstname) {
        err.push({field: 'firstname', message: 'Field cannot be empty'});
    }

    if (!data.lastname) {
        err.push({field: 'lastname', message: 'Field cannot be empty'});
    }

    if (!data.salutation) {
        err.push({field: 'salutation', message: 'Field cannot be empty'});
    } else if (User.salutations.indexOf(data.salutation) === -1) {
        err.push({field: 'salutation', message: 'Invalid value'});
    }
    if (err.length > 0 ) {
        throw new ErrorUtil.ModelValidationError(null, err, 'User');

    }

}

module.exports = User;
