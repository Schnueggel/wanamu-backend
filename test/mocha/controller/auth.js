'use strict';

import mocha from '../../../dist/server/server/config/mocha';
import app from '../../../dist/server/server.js';
import config from '../../../dist/server/server/config';
import assert from 'assert';
import co from 'co';
import databasehelper from '../../../dist/server/server/setup/databasehelper';
import should from 'should';
import _ from 'lodash';

describe('Test Auth Controller', () => {

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

        }).then(done).catch(done);
    });
    it('Should not logout. Wrong method',(done) =>{
        co(function *() {
            const res = yield mocha.request
                .get('/auth/logout')
                .type('json')
                .set('Accept', 'application/json')
                .expect(404)
                .end();

        }).then(done).catch(done);
    });

    it('Should logout', (done) =>{

        co(function *() {
            const res = yield mocha.request
                .post('/auth/logout')
                .type('json')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end();

            res.body.should.be.an.Object;
            res.body.success.should.be.true;

        }).then(done).catch(done);
    });

    it('Should not logout',(done) => {

        co(function*(){
            var res = yield mocha.request
                 .post('/auth/logout')
                 .type('json')
                 .set('Accept', 'application/json')
                 .expect('Content-Type', /json/)
                 .expect(401)
                 .end();

            res.body.should.be.an.Object;
            res.body.success.should.be.true;
        }).then(done).catch(done);
    });

    it('Should login',(done) =>{
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

        }).then(done).catch(done);
    });

    it('Should logout',(done) => {

        co(function *() {
            const res = yield mocha.request
                .post('/auth/logout')
                .type('json')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end();

            res.body.should.be.an.Object;
            res.body.success.should.be.true;

        }).then(done).catch( done);
    });
});

