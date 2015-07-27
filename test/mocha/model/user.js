'use strict';

var assert = require('assert'),
    User = require('../../../dist/server/server/model/user'),
    ErrorUtil = require('../../../dist/server/server/util/error'),
    sequelize = require('../../../dist/server/server/config/sequelize'),
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

    var user = User.build({
        email: 'test1@email.de',
        firstname: 'firstName',
        lastname: 'lastName',
        salutation: 'mr'
    });

    try {
        yield user.save();
        assert(false, true, 'This code should never be reached');
    } catch(err) {
        assert(err instanceof sequelize.Sequelize.ValidationError);
        assert.equal(typeof err.errors,  'object');
        assert.equal(err.errors.length, 1);
        assert.equal(err.errors[0].path, 'password');
    }

    var password = 'abcdefghijk';
    user.password = password;

    yield user.save();
    assert.notEqual(user.password, password);
    assert.equal(user.password.length, 60);

    var isMatch = yield user.comparePassword(password);

    assert(isMatch, true);
}
