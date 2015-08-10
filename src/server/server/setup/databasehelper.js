'use strict';

import User from '../model/user.js';
import TodoList from '../model/todolist.js';
import Profile from '../model/profile';
import Setting from '../model/setting';
import Registration from '../model/registration';
import _ from 'lodash';
import sequelize from '../config/sequelize.js';

module.exports =  {
    DEFAULT_PASSWORD:'abcdefghijk',
    /**
     * Recreates the database. This will clear out all data. For this to use the sequelize user needs to be allowed to drop tables
     */
    truncateDatabase: function*() {
        yield sequelize.sync({force: true});
    },
    /**
     * Create a new random user with settings, profile, registration and default todolist and stores in the database.
     * You can create a new user and overwrite some data or just use the generated user
     * @param {Object} [userdata]
     * @param {Object} [profiledata]
     * @param {Object} [settingsdata]
     * @param {Object} [registrationdata]
     * @returns {User}
     */
    createUser: function*(userdata, profiledata, settingsdata, registrationdata){
        const timestamp = new Date().getTime();

        let userdefault = {
            email: `user${timestamp}@email.com`,
            password: this.DEFAULT_PASSWORD,
            confirmed : 1
        };

        let profiledefault = {
            firstname: 'Firstname',
            lastname: 'Lastname',
            salutation: 'mr'
        };

        let settingsdefault = {};
        let registrationdefault = {};

        if (_.isPlainObject(userdata)) {
            userdefault = _.merge(userdefault, userdata);
        }

        if (_.isPlainObject(profiledata)){
            profiledefault = _.merge(profiledefault, profiledata);
        }

        if (_.isPlainObject(settingsdata)){
            settingsdefault = _.merge(settingsdefault, settingsdata);
        }

        if (_.isPlainObject(registrationdata)){
            registrationdefault = _.merge(registrationdefault, registrationdata);
        }

        let user = yield User.create(userdefault, { isNewRecord: true });
        profiledefault.UserId = user.id;
        settingsdefault.UserId = user.id;
        registrationdefault.UserId = user.id;

        yield Profile.create(profiledefault,{ isNewRecord: true });
        yield Setting.create(settingsdefault, { isNewRecord: true});
        yield Registration.create(registrationdefault, { isNewRecord: true});

        const todolist = yield TodoList.create({
            UserId: user.id,
            name: 'default'
        }, {isNewRecord: true});
        yield user.setDefaultTodoList(todolist);
        user = yield User.findById(user.id,{ include: [{ all: true, nested: true }]});

        return user;
    }
};




