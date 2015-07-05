/**
 * Created by Christian on 5/21/2015.
 */

var request = require('../../../dist/server/server/config/mocha').request,
    app = require('../../../dist/server/server.js'),
    config = require('../../../dist/server/server/config'),
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
            yield app.init();
        }).then(function () {
            done();
        }).catch(function (err) {
            done(err);
        });
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

        }).then(function(){
            done();
        }).catch(function(err){
            done(err);
        });
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

            assert(typeof res.body, 'object');
            assert(res.body.success, true);
            assert(_.isArray(res.body.data));
            assert(res.body.data.length, 1);
            assert(typeof res.body.data[0], 'object');

            userid = res.body.data[0].id;
        }).then(function(){
            done();
        }).catch(function(err){
            done(err);
        });
    });


    it('Should login', function(done){
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
                .expect(200)
                .end();

            assert(res.body.success, true);

        }).then(function(){
            done();
        }).catch(function(err){
            done(err);
        });
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

            assert(typeof res.body, 'object');
            assert(res.body.success, true);
            assert(_.isArray(res.body.data));
            assert(res.body.data.length, 1);
            assert(typeof res.body.data[0], 'object');
            assert(typeof res.body.data[0].firstname, 'hotdog');
            assert(typeof res.body.data[0].firstname, 'kitcat');

        }).then(function(){
            done();
        }).catch(function(err){
            done(err);
        });
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

            assert(typeof res.body, 'object');
            assert(res.body.success, true);
            assert(_.isArray(res.body.data));
            assert(res.body.data.length, 1);
            assert(res.body.data[0].id, userid);
            assert(res.body.data[0].Profile.firstname, 'dog');
            assert(res.body.data[0].Profile.lastname, 'cat');
        }).then(function () {
            done();
        }).catch(function (err) {
           done(err);
        });
    });
});

