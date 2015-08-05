var request = require('../../../dist/server/server/config/mocha').request,
    app = require('../../../dist/server/server.js'),
    config = require('../../../dist/server/server/config'),
    assert = require('assert'), co = require('co'),
    databasehelper = require('../../../dist/server/server/setup/databasehelper'),
    should = require('should'),

    _ = require('lodash');


describe('Test Todolist Controller', function () {
    var user;
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
    it('Should login for todolist creation', function(done){
        co(function *() {
            user = yield databasehelper.createUser();
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

            res.body.should.be.an.Object;
            res.body.success.should.be.true;
            res.body.data.should.be.an.Array;
            res.body.data.should.have.length(1);
            res.body.data.should.be.an.Object;
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
                .delete('/todolist/' + user.DefaultTodoListId)
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

            res.body.should.be.an.Object;
            res.body.success.should.be.true;
            res.body.data.should.be.an.Array;
            res.body.data.should.have.length(0);
            res.body.error.should.be.an.Object;
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
                .get('/todolist/' + user.DefaultTodoListId)
                .type('json')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end();

            res.body.should.be.an.Object;
            res.body.success.should.be.true;
            res.body.data.should.be.an.Array;
            res.body.data.should.have.length(1);
            assert.equal(res.body.data[0].name, 'default');
            assert(_.isArray(res.body.data[0].Todos));
            res.body.data[0].Todos.should.have.length(0);
        }).then(function () {
            done();
        }).catch(function (err) {
            done(err);
        });
    });
});
