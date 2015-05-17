/**
 * Created by Christian on 5/17/2015.
 */


module.exports = {
    UserPasswordNotCreated : UserPasswordNotCreated,
    UserAlreadyExists: UserAlreadyExists,
    ModelValidationError : ModelValidationError
};

/**
 *
 * @param {String} [message]
 * @constructor
 */
function UserPasswordNotCreated (message) {
    this.name = 'UserPasswordNotCreated';
    this.message = message ||  'Unable to create user password.';
    this.stack = (new Error()).stack;
}

UserPasswordNotCreated.prototype = new Error();

/**
 *
 * @param {String} [message]
 * @constructor
 */
function UserAlreadyExists (message) {
    this.name = 'UserAlreadyExists';
    this.message = message;
    this.stack = (new Error()).stack;
}

UserAlreadyExists.prototype = new Error();

/**
 * Error on Model Validation
 * @param {String|null} [message]
 * @param {Array} [errors]
 * @param {String} [model]
 * @constructor
 */
function ModelValidationError (message, errors, model) {
    this.name = 'ModelValidationError';
    this.message = message || 'Data validation error';
    this.errors = errors || [];
    this.model = model;
    this.stack = (new Error()).stack;
}

ModelValidationError.prototype = new Error();
