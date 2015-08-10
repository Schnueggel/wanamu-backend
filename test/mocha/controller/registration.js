'use strict';

var mochaconf = require('../../../dist/server/server/config/mocha'),
    request = mochaconf.request,
    app = require('../../../dist/server/server.js'),
    config = require('../../../dist/server/server/config'),
    Registration = require('../../../dist/server/server/model/registration'),
    databasehelper = require('../../../dist/server/server/setup/databasehelper'),
    should = require('should'),
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
            yield databasehelper.truncateDatabase();
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

            res.body.should.be.an.Object;
            res.body.success.should.be.true;
            res.body.data.should.be.an.Array;
            res.body.data.should.have.length(1);
            res.body.data[0].should.be.an.Object;

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
            res.body.should.be.an.Object;
            res.body.success.should.be.true;

        }).then(function(){
            done();
        }).catch(function(err){
            done(err);
        });
    });
});
