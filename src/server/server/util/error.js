/**
 * Created by Christian on 5/17/2015.
 */

var TodoItError = {};
TodoItError.prototype = new Error();

module.exports = {
    TodoItError : TodoItError,
    TodoNotFound: TodoNotFound,
    AccessViolation: AccessViolation,
    UserPasswordNotCreated : UserPasswordNotCreated,
    UserAlreadyExists : UserAlreadyExists,
    ModelValidationError : ModelValidationError,
    ModelValidationFieldError : ModelValidationFieldError,
    TodoListNotFound : TodoListNotFound,
    TodoAlreadyExists : TodoAlreadyExists,
    UserNotFound : UserNotFound,
    ProfileNotFound : ProfileNotFound,
    TodoListDefaultNoDelete : TodoListDefaultNoDelete,
    NotFound : NotFound
};

/**
 *
 * @param {String} [message]
 * @constructor
 */
function NotFound (message) {
    this.name = 'NotFound';
    this.message = message ||  'The request data could not be found';
}

NotFound.prototype = TodoItError.prototype;

/**
 *
 * @param {String} [message]
 * @constructor
 */
function ProfileNotFound (message) {
    this.name = 'ProfileNotFound';
    this.message = message ||  'The request Profile could not be found';
}

ProfileNotFound.prototype = TodoItError.prototype;

/**
 *
 * @param {String} [message]
 * @constructor
 */
function TodoAlreadyExists (message) {
    this.name = 'TodoAlreadyExists';
    this.message = message ||  'Todo with the same title already exists';
}

TodoAlreadyExists.prototype = TodoItError.prototype;

/**
 *
 * @param {String} [message]
 * @constructor
 */
function TodoListDefaultNoDelete (message) {
    this.name = 'TodoListDefaultNoDelete';
    this.message = message ||  'Default TodoList cannot be deleted';
}

TodoListDefaultNoDelete.prototype = TodoItError.prototype;

/**
 *
 * @param {String} [message]
 * @constructor
 */
function TodoListNotFound (message) {
    this.name = 'TodoListNotFound';
    this.message = message ||  'No valid todolist could be found.';
}

TodoListNotFound.prototype = TodoItError.prototype;

/**
 *
 * @param {String} [message]
 * @constructor
 */
function TodoNotFound (message) {
    this.name = 'TodoNotFound';
    this.message = message ||  'No valid todo could be found.';
}

TodoNotFound.prototype = TodoItError.prototype;

/**
 *
 * @param {String} [message]
 * @constructor
 */
function AccessViolation (message) {
    this.name = 'AccessViolation';
    this.message = message ||  'Not enough permission';
}

AccessViolation.prototype = TodoItError.prototype;
/**
 *
 * @param {String} [message]
 * @constructor
 */
function UserNotFound (message) {
    this.name = 'UserNotFound';
    this.message = message ||  'No valid user could be found.';
}

UserNotFound.prototype = TodoItError.prototype;

/**
 *
 * @param {String} [message]
 * @constructor
 */
function UserPasswordNotCreated (message) {
    this.name = 'UserPasswordNotCreated';
    this.message = message ||  'Unable to create user password.';
}

UserPasswordNotCreated.prototype = TodoItError.prototype;

/**
 *
 * @param {String} [message]
 * @constructor
 */
function UserAlreadyExists (message) {
    this.name = 'UserAlreadyExists';
    this.message = message || 'User already exists.';
}

UserAlreadyExists.prototype = TodoItError.prototype;

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
}

ModelValidationError.prototype = TodoItError.prototype;

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
}

ModelValidationFieldError.prototype = TodoItError.prototype;
