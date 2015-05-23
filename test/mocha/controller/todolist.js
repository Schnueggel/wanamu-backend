/**
 * Created by Christian on 5/21/2015.
 */

var request = require('co-supertest').agent('http://localhost:3000'),
    app = require('../../../dist/server/server.js'),
    assert = require('assert'), co = require('co'),
    _ = require('lodash');


describe('Test Todolist Controller', function () {

    var todoid;
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
    // We create a todolist in the default todolost
    // ==========================================================================
    it('Should create todolist', function(done){
        co(function *() {
            var res = yield request
                .post('/todolist')
                .type('json')
                .send({
                    todolistid: 1,
                    data: {
                        title: 'Feed dog',
                        description: 'Give him some food',
                        alarm: '2015-01-01 15:30',
                        color: '#456789'
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
            assert(res.body.data[0].title, 'Feed dog');

            todoid = res.body.data[0].id;
        }).then(function(){
            done();
        }).catch(function(err){
            done(err);
        });
    });

    it('Should update todo', function(done){
        assert(_.isNumber(todoid));

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

            assert(typeof res.body, 'object');
            assert(res.body.success, true);
            assert(_.isArray(res.body.data));
            assert(res.body.data.length, 1);
            assert(typeof res.body.data[0], 'object');
            assert(res.body.data[0].title, 'Feed the cat');
        }).then(function(){
            done();
        }).catch(function(err){
            done(err);
        });
    });

    it('Should Delete Todo', function (done) {
        assert(_.isNumber(todoid));
        co(function*(){
            var res = yield request
                .delete('/todo/' + todoid)
                .type('json')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end();

            assert(typeof res.body, 'object');
            assert(res.body.success, true);
            assert(_.isArray(res.body.data));
            assert.equal(res.body.data.length, 0);

        }).then(function () {
            done();
        }).catch(function (err) {
            done(err);
        });
    });
});
