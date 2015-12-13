import * as mocha from '../../../dist/server/server/config/mocha';
import app from '../../../dist/server/server.js';
import config from '../../../dist/server/server/config';
import databasehelper from '../../../dist/server/server/setup/databasehelper';
import should from 'should';
import assert from 'assert';
import co from 'co';
import _ from 'lodash';


describe('Test Profile Controller', function () {

    let profile;
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
    // After the test we end the server
    // ==========================================================================
    after((done) =>  {
        app.server.close(done);
    });

    // ==========================================================================
    // First wie check login also to be authorized
    // ==========================================================================
    it('Should login', (done) => {
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

            res.body.success.should.be.true
            assert(_.isPlainObject(res.body));
            res.body.data.should.be.an.Array
            assert(_.isPlainObject(res.body.data[0].Profile));
            assert( _.isNumber(res.body.data[0].Profile.id));

            profile = res.body.data[0].Profile;
        }).then(done).catch(done);
    });


    it('Should get profile', (done) => {
        assert(_.isPlainObject(profile));

        co(function *() {
            const res = yield mocha.request
                .get('/profile/' + profile.id)
                .type('json')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end();

            assert(_.isPlainObject(res.body));
            res.body.success.should.be.true
            res.body.data.should.be.an.Array
            res.body.data.should.have.length(1)
            assert(_.isPlainObject(res.body.data[0]));
            assert(res.body.data[0].firstname, profile.firstname);
            assert(res.body.data[0].lastname, profile.lastname);
        }).then(done).catch(done);
    });

    // ==========================================================================
    // We create a todo_ in the default todolost
    // ==========================================================================
    it('Should update', (done) => {
        co(function *() {
            const res = yield mocha.request
                .put('/profile/' + profile.id)
                .type('json')
                .send({
                    data: {
                        lastname: 'cat',
                        firstname: 'dog',
                        salutation: 'mr'
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
            assert(res.body.data[0].firstname, 'cat');
            assert(res.body.data[0].lastname, 'dog');
            assert(res.body.data[0].salutation, 'mr');

        }).then(done).catch(done);
    });
});
