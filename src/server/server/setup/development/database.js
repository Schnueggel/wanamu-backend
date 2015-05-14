/**
 * Created by Christian on 5/10/2015.
 */
'use strict';

var User = require('../../model/user.js'),
    UserGroup = require('../../model/user-group.js'),
    Category = require('../../model/category.js'),
    Listing = require('../../model/listing.js'),
    co = require('co');

/**
 * Starts the database setup
 * @returns {Promise}
 */
function start() {
    return co(setup);
}

/**
 * Setup complete database
 */
function* setup(){
    yield createCategories();
    yield createUserGroups();
    yield createUsers();
    yield createListing();
    console.log('user created');
}


function* createUsers() {
    yield User.create({
        email: 'test@email.de',
        firstName: 'firstName',
        lastName: 'lastName',
        password: 'abcdef',
        userGroupId: 1
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
function* createListing() {
    yield Listing.bulkCreate([
        {id: 1, title: 'Test Listing 1', userId: 1, categoryId: 3 },
        {id: 2, title: 'Test Listing 2', userId: 1, categoryId: 3 }
    ]);
}

function* createUserGroups() {
    yield UserGroup.bulkCreate([
        {id: 1, name: 'private', flag: 'P' },
        {id: 2, name: 'business', flag: 'G'},
        {id: 3, name: 'admin', flag: 'A'}
    ]);
}

module.exports = start();
