/**
 * Created by Christian on 5/21/2015.
 */

var mochaconf =  require('../../../dist/server/server/config/mocha')
    request = mochaconf.request,
    app = require('../../../dist/server/server.js'),
    config = require('../../../dist/server/server/config'),
    User = require('../../../dist/server/server/model/user'),
    supertest = require('co-supertest'),
    assert = require('assert'),
    co = require('co'),
    _ = require('lodash');

describe('Test User Controller', function () {

    var userid;
    // ==========================================================================
    // Before test we start the server
    // ==========================================================================
    before(function (done) {
        co(function*() {
            yield User.destroy({
                where: {
                    email : 'dog@wanamu.de'
                }
            });
            yield app.init();
        }).then(mochaconf.doneGood(done)).catch(mochaconf.doneErr(done));
    });

    // ==========================================================================
    // After each test we end the server
    // ==========================================================================
    after(function (done) {
        app.server.close(done);
    });

    // =============================================================================================
    // Normally at this point we should be logged in because session is will not destroy on server restart
    // =============================================================================================
    it('Should logout', function(done){

        co(function *() {

            var res = yield request
                .post('/auth/logout')
                .type('json')
                .send({})
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end();

            assert(typeof res.body, 'object');
            assert.equal(res.body.success, true);
            assert(res.body.success, true);

        }).then(mochaconf.doneGood(done))
            .catch(mochaconf.doneErr(done));
    });

    it('Should create user', function(done){

        co(function *() {
            var res = yield request
                .post('/user')
                .type('json')
                .send({
                    data: {
                        email: 'dog@wanamu.de',
                        password: 'abcdefghijk',
                        Profile : {
                           firstname: 'dog',
                           lastname: 'cat',
                           salutation: 'mr'
                        }
                    }
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end();

            assert.equal(typeof res.body, 'object');
            assert.equal(res.body.success, true);
            assert(_.isArray(res.body.data));
            assert.equal(res.body.data.length, 1);
            assert.equal(typeof res.body.data[0], 'object');

            userid = res.body.data[0].id;
            return null;
        }).then(mochaconf.doneGood(done))
            .catch(mochaconf.doneErr(done));
    });
    it('Should not login', function(done){
        co(function *() {
            var res = yield request
                .post('/auth/login')
                .type('form')
                .send({
                    username: 'dog@wanamu.de',
                    password: 'abcdefghijk'
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(424)
                .end();

            assert.equal(res.body.success, false);

        }).then(mochaconf.doneGood(done))
            .catch(mochaconf.doneErr(done));
    });

    it('Should not update user', function(done){
        assert(_.isNumber(userid));

        co(function *() {
            var res = yield request
                .put('/user/' + userid)
                .type('json')
                .send({
                    data: {
                        Profile: {
                            firstname: 'hotdog',
                            lastname: 'kitcat',
                            salutation: 'mr'
                        }
                    }
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(401)
                .end();

            assert.equal(typeof res.body, 'object');
            assert.equal(res.body.success, false);

        }).then(mochaconf.doneGood(done)).catch(mochaconf.doneErr(done));
    });

    it('Should login', function(done){
        co(function *() {
            // =============================================================================================
            // We need to confirm the user before we can update him
            // =============================================================================================
            var user = yield User.findById(userid);
            user.confirmed = 1;
            yield user.save();

            var res = yield request
                .post('/auth/login')
                .type('form')
                .send({
                    username: 'dog@wanamu.de',
                    password: 'abcdefghijk'
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end();

            assert.equal(res.body.success, true);

        }).then(mochaconf.doneGood(done)).catch(mochaconf.doneErr(done));
    });

    it('Should update user', function(done){
        assert(_.isNumber(userid));

        co(function *() {
            var res = yield request
                .put('/user/' + userid)
                .type('json')
                .send({
                    data: {

                        Profile: {
                            firstname: 'hotdog',
                            lastname: 'kitcat',
                            salutation: 'mr'
                        }
                    }
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end();

            assert.equal(typeof res.body, 'object');
            assert.equal(res.body.success, true);
            assert(_.isArray(res.body.data));
            assert.equal(res.body.data.length, 1);
            assert.equal(typeof res.body.data[0], 'object');
            // =============================================================================================
            // Profile should not get updated
            // =============================================================================================
            assert.equal(res.body.data[0].Profile.firstname, 'dog');
            assert.equal(res.body.data[0].Profile.lastname, 'cat');

        }).then(mochaconf.doneGood(done)).catch(mochaconf.doneErr(done));
    });

    it('Should Get User', function (done) {
        assert(_.isNumber(userid));
        co(function*(){
            var res = yield request
                 .get('/user/' + userid)
                 .type('json')
                 .set('Accept', 'application/json')
                 .expect('Content-Type', /json/)
                 .expect(200)
                 .end();

            assert.equal(typeof res.body, 'object');
            assert.equal(res.body.success, true);
            assert(_.isArray(res.body.data));
            assert.equal(res.body.data.length, 1);
            assert.equal(res.body.data[0].id, userid);
            assert.equal(res.body.data[0].Profile.firstname, 'dog');
            assert.equal(res.body.data[0].Profile.lastname, 'cat');
        }).then(mochaconf.doneGood(done)).catch(mochaconf.doneErr(done));
    });
});

