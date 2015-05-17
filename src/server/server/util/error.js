/**
 * Created by Christian on 5/17/2015.
 */


module.exports = {
    UserPasswordNotCreated : UserPasswordNotCreated,
    UserAlreadyExists : UserAlreadyExists,
    ModelValidationError : ModelValidationError,
    ModelValidationFieldError : ModelValidationFieldError,
    TodoListNotFound : TodoListNotFound,
    TodoAlreadyExists : TodoAlreadyExists,
    UserNotFound : UserNotFound
};

/**
 *
 * @param {String} [message]
 * @constructor
 */
function TodoAlreadyExists (message) {
    this.name = 'TodoAlreadyExists';
    this.message = message ||  'Todo with the same title already exists';
    this.stack = (new Error()).stack;
}

/**
 *
 * @param {String} [message]
 * @constructor
 */
function TodoListNotFound (message) {
    this.name = 'TodoListNotFound';
    this.message = message ||  'No valid todolist could be found.';
    this.stack = (new Error()).stack;
}

TodoListNotFound.prototype = new Error();

/**
 *
 * @param {String} [message]
 * @constructor
 */
function UserNotFound (message) {
    this.name = 'UserNotFound';
    this.message = message ||  'No valid user could be found.';
    this.stack = (new Error()).stack;
}

UserNotFound.prototype = new Error();

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

/**
 *
 * @param {String} field
 * @param {String} message
 * @constructor
 */
function ModelValidationFieldError (field, message) {
    this.name = 'ModelValidationFieldError';
    this.message = message;
    this.field = field;
    this.stack = (new Error()).stack;
}

ModelValidationFieldError.prototype = new Error();
