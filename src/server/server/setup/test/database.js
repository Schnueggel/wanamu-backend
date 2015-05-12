'use strict';

/**
 * Created by Christian on 5/6/2015.
 */
var User = require('../../model/user.js'),
    UserGroup = require('../../model/user-group.js'),
    Category = require('../../model/category.js'),
    co = require('co');

function* createUsers() {
    yield User.create({
        email: 'test@email.de',
        firstName: 'firstName',
        lastName: 'lastName',
        password: 'abcdef',
        userGroup: 1
    }, { isNewRecord: true });
    console.log('done');
}

function* createCategories() {
    yield Category.bulkCreate([
        {id: 1, name: 'category1' },
        {id: 2, name: 'category2' },
        {id: 3, name: 'category3', parent: 1}
    ]);
}

function* createUserGroups() {
    yield UserGroup.bulkCreate([
        {id: 1, name: 'private', flag: 'P' },
        {id: 2, name: 'business', flag: 'G'},
        {id: 3, name: 'admin', flag: 'A'}
    ]);
}
/**
 * Setup complete database
 */
function* setup(){
    yield createCategories();
    yield createUserGroups();
    yield createUsers();
    console.log('user created');
}

/**
 * Starts the database setup
 * @returns {Promise}
 */
function start() {
    return co(setup);
}

module.exports = start();

