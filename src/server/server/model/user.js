import sequelize from '../config/sequelize';
import ErrorUtil from '../util/error';
import TodoList from './todolist';
import co from 'co';
import _ from 'lodash';
import bcrypt from '../config/bcrypt';
import Profile from './profile';
import Registration from './registration';
import Friends from './friends';
import Setting from './setting';

/**
 * User Model
 * @name User
 * @namespace model
 * @type {Model}
 */
const User = sequelize.define('User', {
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
    confirmed : {
        type : sequelize.Sequelize.INTEGER,
        defaultValue : 0
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
        beforeUpdate: co.wrap(beforeUpdate)
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
            let without = ['id', 'createdAt', 'updatedAt', 'deletedAt', 'banned'];
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
            let without = ['id', 'createdAt', 'updatedAt'];

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
            let without = ['password', 'confirmhash'];

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
            let fields = User.getVisibleFields(this.isAdmin());
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
            return yield this.updateAttributes({
                DefaultTodoListId: todolist.id
            }, options);
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

User.hasOne(Registration, {
    onDelete: 'Cascade'
});

User.hasOne(Profile, {
    onDelete: 'CASCADE'
});

User.belongsToMany(User, { as: 'Friends', through : Friends});
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
    for(let i = 0; i < users.length; i++) {
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
    let userPassword = this.password;
    return bcrypt.compare(passwordCandidate, userPassword);
}
