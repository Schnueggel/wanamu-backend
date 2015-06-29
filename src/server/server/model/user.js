var sequelize = require('../config/sequelize'),
    ErrorUtil = require('../util/error'),
    TodoList = require('./todolist'),
    Todo = require('./todo'),
    co = require('co'),
    _ = require('lodash'),
    bcrypt = require('../config/bcrypt'),
    Profile = require('./profile'),
    Setting = require('./setting');

/**
 * User Model
 * @type {Model}
 */
var User = sequelize.define('User', {
    id : {
        type: sequelize.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    group: {
        type: sequelize.Sequelize.ENUM('admin', 'user'),
        defaultValue: 'user'
    },
    DefaultTodoListId: {
        type:  sequelize.Sequelize.INTEGER,
        allowNull: true
        /**
         * TODO post creation of foreignkey creation is necessary because UserModel is created first
        references: {
            // This is a reference to another model
            model: 'todolists',// Hack, Model seems not to work: TodoList,

            // This is the column name of the referenced model
            key: 'id'
        }
         */
    },
    email: {
        type: sequelize.Sequelize.STRING(40),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                msg: 'Valid Email is nessecary.'
            }
        }
    },
    password: {
        type: sequelize.Sequelize.CHAR(60).BINARY,
        allowNull: false,
        validate: {
            min: 8
        }
    },
    banned: {
        type: sequelize.Sequelize.DATE,
        allowNull: true,
        defaultValue: null
    }}, {
    // ==========================================================================
    // OPTIONS
    // ==========================================================================
    paranoid: true,
    // ==========================================================================
    // HOOKS
    // ==========================================================================
    hooks: {
        beforeBulkCreate: co.wrap(beforeBulkCreate),
        beforeCreate: co.wrap(beforeCreate),
        beforeUpdate: co.wrap(beforeUpdate),
        afterFind: co.wrap(afterFind)
    },
    // ==========================================================================
    // Class Methods
    // ==========================================================================
    classMethods : {
        hashPassword: hashPassword,
        /**
         * Helper function to get a list of  the fields
         * @returns {String[]}
         */
        getAttribKeys: function() {
            if (this.$attribkeys === undefined) {
                this.$attribkeys = _.keys(this.attributes);
            }
            return this.$attribkeys;
        },
        /**
         * Fields that can be written when creating this model
         * @params {boolean} isAdmin
         * @returns {String[]}
         * @name User.getCreateFields
         */
        getCreateFields: function(isAdmin) {
            var without = ['id', 'createdAt', 'updatedAt', 'deletedAt', 'banned'];
            if (!isAdmin) {
                without = without.concat(['group']);
            }
            return  _.difference(this.getAttribKeys(), without);
        },
        /**
         * Fields that can be written when updating this model
         * @params {boolean} isAdmin
         * @returns {String[]}
         * @name User.getUpdateFields
         */
        getUpdateFields: function(isAdmin) {
            var without = ['id', 'createdAt', 'updatedAt'];

            if (!isAdmin) {
                without = without.concat(['banned', 'group', 'deletedAt']);
            }
            return  _.difference(this.getAttribKeys(), without);
        },
        /**
         * Returns a list of fields that should be visible to users
         * @params {boolean} isAdmin
         * @returns {string[]}
         * @name User.getVisibleFields
         */
        getVisibleFields: function(isAdmin){
            var without = ['password'];

            if (!isAdmin) {
                without = without.concat(['banned', 'deletedAt', 'updatedAt']);
            }
            return _.difference(this.getAttribKeys(),  without);
        },
        /**
         *
         * @param {boolean} isAdmin
         * @returns {*[]}
         * @name User.getIncludeAllOption
         */
        getIncludeAllOption : function(isAdmin) {
            return [
                {
                    model: Setting
                },
                {
                    model: Profile
                },
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
            ];
        }
    },
    // ==========================================================================
    // INSTANCE METHODS
    // ==========================================================================
    instanceMethods: {
        comparePassword: comparePassword,
        isAdmin: function() {
            return this.group === 'admin';
        },
        /**
         * Get the visible data depending on the usergroup
         * @returns {Object}
         */
        getVisibleData: function(){
            var fields = User.getVisibleFields(this.isAdmin());
            fields.push('TodoLists');
            fields.push('Setting');
            fields.push('Profile');
            return _.pick(this.get({plain: true}), fields);
        },
        /**
         *
         * @param {TodoList} todolist
         * @param {Object} [options]
         * @return {Promise}
         */
        setDefaultTodoList: function*(todolist, options) {
            return yield this.update({
                DefaultTodoListId: todolist.id
            }, options);
        },
        filterOut : function(user) {
            if (!_.isArray(user.TodoLists)) {
                return user;
            }

            _.forEach(user.TodoLists, function(todolist) {
                if (_.isFunction(todolist.filterOut)) {
                    todolist.filterOut(todolist);
                }
                if (_.isArray(todolist.Todos)) {
                   _.forEach(todolist.Todos, function(todo) {
                       if (_.isFunction(todo.filterOut)) {
                           todo.filterOut(todo);
                       }
                   });
                }
            });
            return user;
        },
        /**
         * @param {Object} [options]
         * @returns {Promise}
         */
        getDefaultTodoList: function*(options) {
            return yield TodoList.findById(this.DefaultTodoListId, options);
        }
    }
});


User.hasMany(TodoList, {
    // ==========================================================================
    // We prevent UserId foreignKey in TodoList from beeing null
    // ==========================================================================
    onDelete: 'CASCADE',
    foreignKey: {allowNull: false }
});

User.hasOne(Setting, {
    onDelete: 'CASCADE'
});


User.hasOne(Profile, {
    onDelete: 'CASCADE'
});

module.exports = User;


/**
 * ######################################################################################
 * ######################################################################################
 * Helper Functions
 * ######################################################################################
 * ######################################################################################
 */


/**
 * Before Bulk create
 * @param users
 * @param options
 */
function* beforeBulkCreate (users, options){
    for(var i = 0; i < users.length; i++) {
        yield* beforeCreate(users[i], options);
    }
}
/**
 * Before Create Hook
 * @param user
 * @param options
 * @param fn only exists if the signature of the hook has a third argument but co.wrap(afterCreate) creates function(){}
 *
 */
function* beforeCreate(user, options){
    yield hashPassword(user);
}
/**
 * Before Update Hook
 * @param user
 * @param options
 */
function* beforeUpdate(user, options){
    // ==========================================================================
    // Check if password should be updated. If so we encrypt it
    // ==========================================================================
    if (options.fields && options.fields.indexOf('password') === -1) {
        return;
    }
    yield hashPassword(user);
}

/**
 * Hashs the user password
 * @param user
 */
function* hashPassword(user) {
    try {
        user.password = yield bcrypt.hashAndSalt(user.password);
    } catch(err) {
        throw new ErrorUtil.UserPasswordNotCreated();
    }
}

function comparePassword(passwordCandidate) {
    var userPassword = this.password;
    return bcrypt.compare(passwordCandidate, userPassword);
}

function* afterFind(user) {
    if (user) {
        user.filterOut(user);
    }

    return;
}
