/**
 * Created by Christian on 5/21/2015.
 */

var request = require('co-supertest').agent('http://localhost:3000'),
    app = require('../../../dist/server/server.js'),
    assert = require('assert'), co = require('co'),
    _ = require('lodash');


describe('Test Todolist Controller', function () {

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

    // ==========================================================================
    // First wie check login also to be authorized
    // ==========================================================================
    it('Should login for todolist creation', function(done){
        co(function *() {
            var res = yield request
                .post('/auth/login')
                .type('form')
                .send({
                    username: 'test@email.de',
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

    // ==========================================================================
    // We  a todolist in the default todolost
    // ==========================================================================
    it('Should list Todolists for the logged in User', function(done){
        co(function *() {
            var res = yield request
                .get('/todolist')
                .type('json')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end();

            assert(typeof res.body, 'object');
            assert(res.body.success, true);
            assert(_.isArray(res.body.data));
            assert(res.body.data.length, 1);
            assert(typeof res.body.data[0], 'object');
            assert(res.body.data[0].name, 'default');

        }).then(function(){
            done();
        }).catch(function(err){
            done(err);
        });
    });

    it('Should not delete default Todolist', function(done){
        co(function *() {
            var res = yield request
                .delete('/todolist/1')
                .type('json')
                .send({
                    data: {
                        title: 'Feed the cat',
                        alarm: '2014-05-05'
                    }
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(403)
                .end();

            assert.equal(typeof res.body, 'object');
            assert.equal(res.body.success, false);
            assert(_.isArray(res.body.data));
            assert.equal(res.body.data.length, 0);
            assert.equal(typeof res.body.error, 'object');
            assert.equal(res.body.error.name, 'TodoListDefaultNoDelete');
        }).then(function(){
            done();
        }).catch(function(err){
            done(err);
        });
    });

    it('Should Get Todolist', function (done) {
        co(function*(){
            var res = yield request
                .get('/todolist/1')
                .type('json')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end();

            assert.equal(typeof res.body, 'object');
            assert.equal(res.body.success, true);
            assert(_.isArray(res.body.data));
            assert.equal(res.body.data.length, 1);
            assert.equal(res.body.data[0].name, 'default');
            assert(_.isArray(res.body.data[0].Todos));
            assert(res.body.data[0].Todos.length > 1);
            assert(typeof res.body.data[0].Todos[0].title, 'string');
        }).then(function () {
            done();
        }).catch(function (err) {
            done(err);
        });
    });
});
