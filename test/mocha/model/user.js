'use strict';

import assert from 'assert';
import User from '../../../dist/server/server/model/user';
import ErrorUtil from '../../../dist/server/server/util/error';
import sequelize from '../../../dist/server/server/config/sequelize';
import co from 'co';


describe('Test User Model', () => {

    it('Should create User', (done) => {
        assert.equal(typeof User, 'object');

        co(testCreateUser).then(done).catch(done);
    });
});


function* testCreateUser(){

    const user = User.build({
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

    const password = 'abcdefghijk';
    user.password = password;

    yield user.save();
    assert.notEqual(user.password, password);
    assert.equal(user.password.length, 60);

    const isMatch = yield user.comparePassword(password);

    assert(isMatch, true);
}
