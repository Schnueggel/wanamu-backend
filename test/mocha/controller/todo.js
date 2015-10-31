'use strict';

import mocha from '../../../dist/server/server/config/mocha';
import app from '../../../dist/server/server.js';
import config from '../../../dist/server/server/config';
import assert from 'assert';
import co from 'co';
import databasehelper from '../../../dist/server/server/setup/databasehelper';
import should from 'should';
import _ from 'lodash';

describe('Test Todo Controller', () => {

    let todoid,
        todolistid;
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
    it('Should login', (done) =>{
        co(function *() {
            const user = yield databasehelper.createUser();
            const res = yield mocha.request
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
        }).then(done).catch(done);
    });

    // ==========================================================================
    // We create a todo_ in the default todolost
    // ==========================================================================
    it('Should create todo', (done) =>{
        co(function *() {
            const res = yield mocha.request
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
        }).then(done).catch(done);
    });

    it('Should update todo', (done) =>{
        todoid.should.be.a.Number

        co(function *() {
            const res = yield mocha.request
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
        }).then(done).catch(done);
    });

    it('Should Delete Todo', (done) => {
        todoid.should.be.a.Number
        co(function*(){
            const res = yield mocha.request
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

        }).then(done).catch(done);
    });
});
