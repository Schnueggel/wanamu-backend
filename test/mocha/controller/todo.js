'use strict';
var request = require('../../../dist/server/server/config/mocha').request,
    app = require('../../../dist/server/server.js'),
    config = require('../../../dist/server/server/config'),
    assert = require('assert'),
    co = require('co'),
    databasehelper = require('../../../dist/server/server/setup/databasehelper'),
    should = require('should'),
    _ = require('lodash');


describe('Test Todo Controller', function () {

    var todoid;
    var todolistid;
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
    // After each test we end the server
    // ==========================================================================
    after(function (done) {
        app.server.close(done);
    });

    // ==========================================================================
    // First wie check login also to be authorized
    // ==========================================================================
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
            res.body.data.should.be.an.Array;
            res.body.data.should.have.length(1);
            assert(_.isNumber(res.body.data[0].DefaultTodoListId));
            todolistid = res.body.data[0].DefaultTodoListId;
        }).then(function(){
            done();
        }).catch(function(err){
            done(err);
        });
    });

    // ==========================================================================
    // We create a todo_ in the default todolost
    // ==========================================================================
    it('Should create todo', function(done){
        co(function *() {
            var res = yield request
                .post('/todo')
                .type('json')
                .send({
                    data: {
                        title: 'Feed dog',
                        description: 'Give him some food',
                        alarm: '2015-01-01 15:30',
                        color: 'color1',
                        TodoListId: todolistid
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
            res.body.data.should.be.an.Object;
            assert(res.body.data[0].title, 'Feed dog');

            todoid = res.body.data[0].id;
        }).then(function(){
            done();
        }).catch(function(err){
            done(err);
        });
    });

    it('Should update todo', function(done){
        todoid.should.be.a.Number

        co(function *() {
            var res = yield request
                .put('/todo/' + todoid)
                .type('json')
                .send({
                    data: {
                        title: 'Feed the cat',
                        alarm: '2014-05-05'
                    }
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end();

            res.body.should.be.an.Object
            res.body.success.should.be.true
            res.body.data.should.be.an.Array
           res.body.data.should.have.length(1)
            res.body.data.should.be.an.Object
            assert(res.body.data[0].title, 'Feed the cat');
        }).then(function(){
            done();
        }).catch(function(err){
            done(err);
        });
    });

    it('Should Delete Todo', function (done) {
        todoid.should.be.a.Number
        co(function*(){
            var res = yield request
                .delete('/todo/' + todoid)
                .type('json')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end();

            res.body.should.be.an.Object
            res.body.success.should.be.true
            res.body.data.should.be.an.Array
            res.body.data.should.have.length(1)

        }).then(function () {
            done();
        }).catch(function (err) {
            done(err);
        });
    });
});
