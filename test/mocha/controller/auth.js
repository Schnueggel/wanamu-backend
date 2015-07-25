'use strict';
let request = require('../../../dist/server/server/config/mocha').request,
    app = require('../../../dist/server/server.js'),
    config = require('../../../dist/server/server/config'),
    assert = require('assert'), co = require('co'),
    _ = require('lodash');

describe('Test Auth Controller', function () {

    // ==========================================================================
    // Before test we start the server
    // ==========================================================================
    before((done) => {

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

    it('Should login', function(done){
        co(function *() {
            var res = yield request
                .post('/auth/login')
                .type('form')
                .send({
                    username: config.get('testmail1'),
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
    it('Should not logout. Wrong method', function(done){
        co(function *() {
            var res = yield request
                .get('/auth/logout')
                .type('json')
                .set('Accept', 'application/json')
                .expect(404)
                .end();

        }).then(function(){
            done();
        }).catch(function(err){
            done(err);
        });
    });

    it('Should logout', function(done){

        co(function *() {
            var res = yield request
                .post('/auth/logout')
                .type('json')
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

    it('Should not logout', function (done) {

        co(function*(){
            var res = yield request
                 .post('/auth/logout')
                 .type('json')
                 .set('Accept', 'application/json')
                 .expect('Content-Type', /json/)
                 .expect(401)
                 .end();

            assert(typeof res.body, 'object');
            assert.equal(res.body.success, false);
        }).then(function () {
            done();
        }).catch(function (err) {
           done(err);
        });
    });

    it('Should login', function(done){
        co(function *() {
            var res = yield request
                .post('/auth/login')
                .type('form')
                .send({
                    username: config.get('testmail1'),
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

    it('Should logout', function(done){

        co(function *() {
            var res = yield request
                .post('/auth/logout')
                .type('json')
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
});

