'use strict';
/**
 * Created by Christian on 5/6/2015.
 */
var assert = require('assert'),
    mongo = require('../../../dist/server/server/config/mongo.js'),
    User = require('../../../dist/server/server/model/user.js'),
    ErrorUtil = require('../../../dist/server/server/util/error.js'),
    co = require('co');


describe('Test User Model', function () {

    it('Should create User', function (done) {
        assert.equal(typeof User, 'object');

        co(testCreateUser).then(function(){
            done();
        }).catch(function(err){
            console.error(err);
            done(err);
        });
    });
});


function* testCreateUser(){
    var user;
    try {
        user = yield User.create({
            email: 'test1@email.de',
            firstname: 'firstname',
            lastname: 'lastname',
            salutation: 'mr'
        });
        assert(false, true, 'We should not reach this point');
    } catch( err ) {
        assert(err instanceof ErrorUtil.ModelValidationError);
        assert(err.errors.length > 0);
        assert(typeof user, 'undefined');
    }

    var userData = {
        email: 'test1@email.de',
        password: 'abcdefghijk',
        firstname: 'firstname',
        lastname: 'lastname',
        salutation: 'mr'
    };

    user = yield User.create(userData);

    assert.notEqual(user, null);

    assert(user.email, 'test1@email.de');
    assert(user.password);
    assert(user._id);
    assert(user.firstname, 'firstname');
    assert(user.lastname, 'lastname');
    assert(user.salutation, 'mr');
    assert(typeof user.todolists, 'object');

    // ==========================================================================
    // Try to create the same user again
    // ==========================================================================
    try {
        user = yield User.create(userData);
    } catch(err) {
        assert(err instanceof ErrorUtil.UserAlreadyExists);
    }
}
