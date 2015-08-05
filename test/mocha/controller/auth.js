'use strict';
let request = require('../../../dist/server/server/config/mocha').request,
    app = require('../../../dist/server/server.js'),
    config = require('../../../dist/server/server/config'),
    assert = require('assert'), co = require('co'),
    databasehelper = require('../../../dist/server/server/setup/databasehelper'),
    should = require('should'),
    _ = require('lodash');

describe('Test Auth Controller', function () {

    // ==========================================================================
    // Before test we start the server
    // ==========================================================================
    before((done) => {

        co(function*() {
            yield databasehelper.truncateDatabase();
            yield app.init();
        }).then(function () {
            console.log('hui');
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
            var user = yield databasehelper.createUser();
            var res = yield request
                .post('/auth/login')
                .type('form')
                .send({
                    username: user.email,
                    password: databasehelper.DEFAULT_PASSWORD
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end();

            res.body.success.should.be.true;

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

            res.body.should.be.an.Object;
            res.body.success.should.be.true;

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

            res.body.should.be.an.Object;
            res.body.success.should.be.true;
        }).then(function () {
            done();
        }).catch(function (err) {
           done(err);
        });
    });

    it('Should login', function(done){
        co(function *() {
            var user = yield databasehelper.createUser();
            var res = yield request
                .post('/auth/login')
                .type('form')
                .send({
                    username: user.email,
                    password: databasehelper.DEFAULT_PASSWORD
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end();

            res.body.success.should.be.true;

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

            res.body.should.be.an.Object;
            res.body.success.should.be.true;

        }).then(function(){
            done();
        }).catch(function(err){
            done(err);
        });
    });
});

