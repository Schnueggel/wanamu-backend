import mocha from '../../../dist/server/server/config/mocha';
import app from '../../../dist/server/server.js';
import config from '../../../dist/server/server/config';
import assert from 'assert';
import co from 'co';
import databasehelper from '../../../dist/server/server/setup/databasehelper';
import should from 'should';
import _ from 'lodash';

describe('Test Setting Controller', () => {

    let setting;
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
    after((done) => {
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

            res.body.success.should.be.true;
            assert(_.isPlainObject(res.body));
            res.body.data.should.be.an.Array;
            assert(_.isPlainObject(res.body.data[0].Setting));
            assert(_.isNumber(res.body.data[0].Setting.id));

            setting = res.body.data[0].Setting;
        }).then(done).catch(done);
    });


    it('Should get setting', (done) => {
        assert(_.isPlainObject(setting));

        co(function *() {
            const res = yield mocha.request
                .get('/setting/' + setting.id)
                .type('json')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end();

            res.body.should.be.an.Object;
            res.body.success.should.be.true;
            res.body.data.should.be.an.Array;
            res.body.data.should.have.length(1);
            assert(_.isPlainObject(res.body.data[0]));
            should(res.body.data[0].color1).be.exactly(setting.color1);
            should(res.body.data[0].color2).be.exactly(setting.color2);
        }).then(done).catch(done);
    });

    // ==========================================================================
    // We create a todo_ in the default todolost
    // ==========================================================================
    it('Should update', (done) => {
        co(function *() {
            const res = yield mocha.request
                .put('/setting/' + setting.id)
                .type('json')
                .send({
                    data: {
                        color1: 'color1'
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
            assert(res.body.data[0].color1, 'color1');

        }).then(done).catch(done);
    });
});
