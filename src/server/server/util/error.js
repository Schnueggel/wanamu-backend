/**
 * Base Error
 * @constructor
 */
export class WanamuError extends Error {
    /**
     *
     * @param {String} message
     */
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;
        //Show the name of the parent class in the stack trace
        Error.captureStackTrace(this, this.constructor.name);
    }
}

/**
 *
 * @param {String} [message]
 * @constructor
 */
export class NotConfirmed extends WanamuError {
}

/**
 *
 * @param {String} [message]
 * @constructor
 */
export class AlreadyReported extends WanamuError {
}

/**
 *
 * @param {String} [message]
 * @constructor
 */
export class NotIdentified extends WanamuError {
}

/**
 *
 * @param {String} [message]
 * @constructor
 */
export class ServerError extends WanamuError {
    constructor(message = 'ServerError.') {
        super(message);
    }
}

/**
 *
 * @param {String} [message]
 * @constructor
 */
export class NotFound extends WanamuError {
    constructor(message = 'The request data could not be found.') {
        super(message);
    }
}

/**
 *
 * @param {String} [message]
 * @constructor
 */
export class ProfileNotFound extends WanamuError {
    constructor(message = 'The request Profile could not be found.') {
        super(message);
    }
}

/**
 *
 * @param {String} [message]
 * @constructor
 */
export class TodoAlreadyExists extends WanamuError {
    constructor(message = 'Todo with the same title already exists.') {
        super(message);
    }
}

/**
 *
 * @param {String} [message]
 * @constructor
 */
export class TodoListDefaultNoDelete extends WanamuError {
    constructor(message = 'Default TodoList cannot be deleted.') {
        super(message);
    }
}

/**
 *
 * @param {String} [message]
 * @constructor
 */
export class TodoListNotFound extends WanamuError {
    constructor(message = 'No valid todolist could be found.') {
        super(message);
    }
}

/**
 *
 * @param {String} [message]
 * @constructor
 */
export class TodoNotFound extends WanamuError {
    constructor(message = 'No valid todo could be found.') {
        super(message);
    }
}

/**
 *
 * @param {String} [message]
 * @constructor
 */
export class AccessViolation extends WanamuError {
    constructor(message = 'Not enough permission') {
        super(message);
    }
}

/**
 *
 * @param {String} [message]
 * @constructor
 */
export class UserNotFound extends WanamuError {
    constructor(message = 'No valid user could be found.') {
        super(message);
    }
}

/**
 *
 * @param {String} [message]
 * @constructor
 */
export class UserPasswordNotCreated extends WanamuError {
    constructor(message = 'Unable to create user password.') {
        super(message);
    }
}

/**
 *
 * @param {String} [message]
 * @constructor
 */
export class UserAlreadyExists extends WanamuError {
    constructor(message = 'User already exists.') {
        super(message);
    }
}

/**
 * Error on Model Validation
 * @param {String|null} [message]
 * @param {Array} [errors]
 * @param {String} [model]
 * @constructor
 */
export class ModelValidationError extends WanamuError {
    constructor(message, errors, model) {
        super(message);
        this.errors = errors || [];
        this.model = model;
    }
}

/**
 *
 * @param {String} field
 * @param {String} message
 * @constructor
 */
export class ModelValidationFieldError extends WanamuError {
    constructor(field, message) {
        super(message);
        this.field = field;
    }
}
