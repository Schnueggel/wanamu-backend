'use strict';

var mochaconf = require('../../../dist/server/server/config/mocha'),
    request = mochaconf.request,
    app = require('../../../dist/server/server.js'),
    config = require('../../../dist/server/server/config'),
    Registration = require('../../../dist/server/server/model/registration'),
    assert = require('assert'), co = require('co'),
    _ = require('lodash');

describe('Test Registration Controller', function () {

    var registeremail = 'dog@registertest.de';
    var confirmationhash;
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
    // After the test we end the server
    // ==========================================================================
    after(function (done) {
        app.server.close(done);
    });

    // ==========================================================================
    // First wie check login also to be authorized
    // ==========================================================================
    it('should Register', function(done){

        co(function *() {
            //TODO destroy session on each te
            var res = yield request
                .post('/auth/logout')
                .type('json')
                .send({})
                .set('Accept', 'application/json')
                .end();

            var res = yield request
                .post('/user')
                .type('json')
                .send({
                    data: {
                        email: registeremail,
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
        }).then(mochaconf.doneGood(done))
            .catch(mochaconf.doneErr(done));
    });


    it('should get confirmation hash', function(done){
        assert(_.isNumber(userid));

        co(function *() {
            var registration = yield Registration.findOne({
             where : {
                 UserId:userid
             }
            });
            assert(_.isObject(registration));
            confirmationhash = registration.confirmhash;
        }).then(function(){
            done();
        }).catch(function(err){
            done(err);
        });
    });

    // ==========================================================================
    // We create a todo_ in the default todolost
    // ==========================================================================
    it('should confirm', function(done){

        assert(_.isString(confirmationhash));

        co(function *() {
            var res = yield request
                .get('/confirmation/' + confirmationhash)
                .type('json')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end();
            assert(typeof res.body, 'object');
            assert(res.body.success, true);

        }).then(function(){
            done();
        }).catch(function(err){
            done(err);
        });
    });
});
