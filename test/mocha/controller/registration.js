'use strict';

import * as mochaConfig from '../../../dist/server/server/config/mocha';
import app from '../../../dist/server/server.js';
import config from '../../../dist/server/server/config';
import Registration from '../../../dist/server/server/model/registration';
import databasehelper from '../../../dist/server/server/setup/databasehelper';
import should from 'should';
import assert from 'assert';
import co from 'co';
import _ from 'lodash';

describe('Test Registration Controller', function () {

    let registeremail = 'dog@registertest.de',
        confirmationhash,
        userid;
    // ==========================================================================
    // Before test we start the server
    // ==========================================================================
    before(function (done) {

        co(function*() {
            yield databasehelper.truncateDatabase();
            yield app.init();
        }).then(done).catch(done);
    });

    // ==========================================================================
    // After the test we end the server
    // ==========================================================================
    after(function (done) {
        app.server.close(done);
    });

    // ==========================================================================
    // First wie check login also to be authorized
    // ==========================================================================
    it('should Register', function(done){

        co(function *() {
            const res = yield mochaConfig.request
                .post('/user')
                .type('json')
                .send({
                    data: {
                        email: registeremail,
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
        }).then(done).catch(done);
    });


    it('should get confirmation hash', function(done){
        assert(_.isNumber(userid));

        co(function *() {
            const registration = yield Registration.findOne({
             where : {
                 UserId:userid
             }
            });
            assert(_.isObject(registration));
            confirmationhash = registration.confirmhash;
        }).then(done).catch(done);
    });

    // ==========================================================================
    // We create a todo_ in the default todolost
    // ==========================================================================
    it('should confirm', function(done){

        assert(_.isString(confirmationhash));

        co(function *() {
            const res = yield mochaConfig.request
                .get('/confirmation/' + confirmationhash)
                .type('json')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end();
            res.body.should.be.an.Object;
            res.body.success.should.be.true;

        }).then(done).catch(done);
    });
});
