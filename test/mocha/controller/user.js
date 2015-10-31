import mochaConfig from '../../../dist/server/server/config/mocha';
import app from '../../../dist/server/server.js';
import config from '../../../dist/server/server/config';
import User from '../../../dist/server/server/model/user';
import supertest from 'co-supertest';
import should from 'should';
import databasehelper from '../../../dist/server/server/setup/databasehelper';
import co from 'co';
import _ from 'lodash';

describe('Test User Controller', () => {

    let userid;
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

    it('Should create user', (done) => {

        co(function *() {
            const res = yield mochaConfig.request
                .post('/user')
                .type('json')
                .send({
                    data: {
                        email: 'dog@wanamu.de',
                        password: 'abcdefghijk',
                        Profile : {
                           firstname: 'dog',
                           lastname: 'cat',
                           salutation: 'mr'
                        }
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
            res.body.data[0].should.be.an.Object;

            userid = res.body.data[0].id;
            return null;
        }).then(done).catch(done);
    });

    it('Should not login', (done) => {
        co(function *() {
            const res = yield mochaConfig.request
                .post('/auth/login')
                .type('form')
                .send({
                    username: 'dog@wanamu.de',
                    password: 'abcdefghijk'
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(424)
                .end();

            res.body.success.should.be.true;

        }).then(done).catch(done);
    });

    it('Should not update user', (done) => {
        userid.should.be.a.Number;

        co(function *() {
            const res = yield mochaConfig.request
                .put('/user/' + userid)
                .type('json')
                .send({
                    data: {
                        Profile: {
                            firstname: 'hotdog',
                            lastname: 'kitcat',
                            salutation: 'mr'
                        }
                    }
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(401)
                .end();

            res.body.should.be.an.Object;
            res.body.success.should.be.true;

        }).then(done).catch(done);
    });

    it('Should login', (done) => {
        co(function *() {
            // =============================================================================================
            // We need to confirm the user before we can update him
            // =============================================================================================
            const user = yield User.findById(userid);
            user.confirmed = 1;
            yield user.save();

            const res = yield mochaConfig.request
                .post('/auth/login')
                .type('form')
                .send({
                    username: 'dog@wanamu.de',
                    password: 'abcdefghijk'
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end();

            res.body.success.should.be.true;

        }).then(done).catch(done);
    });

    it('Should update user', (done) => {
        userid.should.be.a.Number;

        co(function *() {
            const res = yield mochaConfig.request
                .put('/user/' + userid)
                .type('json')
                .send({
                    data: {

                        Profile: {
                            firstname: 'hotdog',
                            lastname: 'kitcat',
                            salutation: 'mr'
                        }
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
            res.body.data[0].should.be.an.Object;
            // =============================================================================================
            // Profile should not get updated
            // =============================================================================================
           res.body.data[0].Profile.firstname.should.equal('dog');
           res.body.data[0].Profile.lastname.should.equal('cat');

        }).then(done).catch(done);
    });

    it('Should Get User', (done) => {
        userid.should.be.a.Number;
        co(function*(){
            const res = yield mochaConfig.request
                 .get('/user/' + userid)
                 .type('json')
                 .set('Accept', 'application/json')
                 .expect('Content-Type', /json/)
                 .expect(200)
                 .end();

            res.body.should.be.an.Object;
            res.body.success.should.be.true;
            res.body.data.should.be.an.Array;
            res.body.data.should.have.length(1);
            res.body.data[0].id.should.equal(userid);
            res.body.data[0].Profile.firstname.should.equal('dog');
            res.body.data[0].Profile.lastname.should.equal('cat');
        }).then(done).catch(done);
    });
});

