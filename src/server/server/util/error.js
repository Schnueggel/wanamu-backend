/**
 * Created by Christian on 5/17/2015.
 */
var util = require('util');

/**
 * Base Error
 * @constructor
 */
var WanamuError = function() {
    Error.call(this);
    Error.captureStackTrace(this, arguments.callee);
    this.message = message;
};

util.inherits(WanamuError, Error);

module.exports = {
    WanamuError : WanamuError,
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
    NotFound : NotFound,
    NotIdentified : NotIdentified,
    NotConfirmed : NotConfirmed,
    AlreadyReported : AlreadyReported,
    ServerError : ServerError
};

/**
 *
 * @param {String} [message]
 * @constructor
 */
function NotConfirmed (message) {
    this.name = 'NotConfirmed';
    this.message = message;
}
util.inherits(NotConfirmed, WanamuError);

/**
 *
 * @param {String} [message]
 * @constructor
 */
function AlreadyReported (message) {
    this.name = 'AlreadyReported';
    this.message = message;
}
util.inherits(AlreadyReported, WanamuError);

/**
 *
 * @param {String} [message]
 * @constructor
 */
function NotIdentified (message) {
    this.name = 'NotIdentified';
    this.message = message;
}

util.inherits(NotIdentified, WanamuError);

/**
 *
 * @param {String} [message]
 * @constructor
 */
function ServerError (message) {
    this.name = 'ServerError';
    this.message = message ||  'ServerError';
}

util.inherits(ServerError, WanamuError);


/**
 *
 * @param {String} [message]
 * @constructor
 */
function NotFound (message) {
    this.name = 'NotFound';
    this.message = message ||  'The request data could not be found';
}

util.inherits(NotFound, WanamuError);
/**
 *
 * @param {String} [message]
 * @constructor
 */
function ProfileNotFound (message) {
    this.name = 'ProfileNotFound';
    this.message = message ||  'The request Profile could not be found';
}
util.inherits(ProfileNotFound, WanamuError);

/**
 *
 * @param {String} [message]
 * @constructor
 */
function TodoAlreadyExists (message) {
    this.name = 'TodoAlreadyExists';
    this.message = message ||  'Todo with the same title already exists';
}

util.inherits(TodoAlreadyExists, WanamuError);

/**
 *
 * @param {String} [message]
 * @constructor
 */
function TodoListDefaultNoDelete (message) {
    this.name = 'TodoListDefaultNoDelete';
    this.message = message ||  'Default TodoList cannot be deleted';
}

util.inherits(TodoListDefaultNoDelete, WanamuError);

/**
 *
 * @param {String} [message]
 * @constructor
 */
function TodoListNotFound (message) {
    this.name = 'TodoListNotFound';
    this.message = message ||  'No valid todolist could be found.';
}
util.inherits(TodoListNotFound, WanamuError);

/**
 *
 * @param {String} [message]
 * @constructor
 */
function TodoNotFound (message) {
    this.name = 'TodoNotFound';
    this.message = message ||  'No valid todo could be found.';
}

util.inherits(TodoNotFound, WanamuError);
/**
 *
 * @param {String} [message]
 * @constructor
 */
function AccessViolation (message) {
    this.name = 'AccessViolation';
    this.message = message ||  'Not enough permission';
}

util.inherits(AccessViolation, WanamuError);
/**
 *
 * @param {String} [message]
 * @constructor
 */
function UserNotFound (message) {
    this.name = 'UserNotFound';
    this.message = message ||  'No valid user could be found.';
}
util.inherits(UserNotFound, WanamuError);

/**
 *
 * @param {String} [message]
 * @constructor
 */
function UserPasswordNotCreated (message) {
    this.name = 'UserPasswordNotCreated';
    this.message = message ||  'Unable to create user password.';
}

util.inherits(UserPasswordNotCreated, WanamuError);

/**
 *
 * @param {String} [message]
 * @constructor
 */
function UserAlreadyExists (message) {
    this.name = 'UserAlreadyExists';
    this.message = message || 'User already exists.';
}

util.inherits(UserAlreadyExists, WanamuError);

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

util.inherits(ModelValidationError, WanamuError);

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

util.inherits(ModelValidationFieldError, WanamuError);
