import mochaConfig from '../../../dist/server/server/config/mocha';
import app from '../../../dist/server/server.js';
import config from '../../../dist/server/server/config';
import assert from 'assert';
import co from 'co';
import databasehelper from '../../../dist/server/server/setup/databasehelper';
import should from 'should';
import _ from 'lodash';

describe('Test Todolist Controller',() => {

    let user;
    // ==========================================================================
    // Before test we start the server
    // ==========================================================================
    before((done) => {

        co(function*() {
            yield databasehelper.truncateDatabase();
            yield app.init();
        }).then(done).catch(done);
    });

    // ==========================================================================
    // After each test we end the server
    // ==========================================================================
    after((done) => {
        app.server.close(done);
    });

    // ==========================================================================
    // First wie check login also to be authorized
    // ==========================================================================
    it('Should login for todolist creation', (done) => {
        co(function *() {
            user = yield databasehelper.createUser();
            const res = yield mochaConfig.request
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
        }).then(done).catch(done);
    });

    // ==========================================================================
    // We  a todolist in the default todolost
    // ==========================================================================
    it('Should list Todolists for the logged in User', (done) => {
        co(function *() {
            const res = yield mochaConfig.request
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

        }).then(done).catch(done);
    });

    it('Should not delete default Todolist', (done) => {
        co(function *() {
            const res = yield mochaConfig.request
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
        }).then(done).catch(done);
    });

    it('Should Get Todolist', (done) => {
        co(function*(){
            const res = yield mochaConfig.request
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
        }).then(done).catch(done);
    });
});
