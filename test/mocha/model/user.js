'use strict';
/**
 * Created by Christian on 5/6/2015.
 */
var assert = require('assert'),
    User = require('../../../dist/server/server/model/user'),
    Util = require('../../../dist/server/server/util/util.js'),
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
            email: 'test1@email.de'
        });
        assert(false, true, 'We should not reach this point');
    } catch( err ) {
        assert(err.name, Util.ERRORS.INVALID_USER_PASSWORD.name);
        assert(typeof user, 'undefined');
    }
}
