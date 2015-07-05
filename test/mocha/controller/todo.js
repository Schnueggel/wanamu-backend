/**
 * Created by Christian on 5/21/2015.
 */

var request = require('../../../dist/server/server/config/mocha').request,
    app = require('../../../dist/server/server.js'),
    config = require('../../../dist/server/server/config'),
    assert = require('assert'), co = require('co'),
    _ = require('lodash');


describe('Test Todo Controller', function () {

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
    it('Should login', function(done){
        co(function *() {
            var res = yield request
                .post('/auth/login')
                .type('form')
                .send({
                    username: config.getTestMail1(),
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
                        color: '#456789',
                        TodoListId: 1
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
            assert.equal(res.body.data.length, 1);

        }).then(function () {
            done();
        }).catch(function (err) {
            done(err);
        });
    });
});
