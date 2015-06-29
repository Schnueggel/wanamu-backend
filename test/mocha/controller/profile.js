var request = require('../../../dist/server/server/config/mocha').request,
    app = require('../../../dist/server/server.js'),
    assert = require('assert'), co = require('co'),
    _ = require('lodash');


describe('Test Profile Controller', function () {

    var profile;
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
    // After the test we end the server
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
                    username: 'test@email.de',
                    password: 'abcdefghijk'
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end();

            assert(res.body.success, true);
            assert(_.isPlainObject(res.body));
            assert(_.isArray(res.body.data));
            assert(_.isPlainObject(res.body.data[0].Profile));
            assert( _.isNumber(res.body.data[0].Profile.id));

            profile = res.body.data[0].Profile;
        }).then(function(){
            done();
        }).catch(function(err){
            done(err);
        });
    });


    it('Should get profile', function(done){
        assert(_.isPlainObject(profile));

        co(function *() {
            var res = yield request
                .get('/profile/' + profile.id)
                .type('json')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end();

            assert(_.isPlainObject(res.body));
            assert(res.body.success, true);
            assert(_.isArray(res.body.data));
            assert(res.body.data.length, 1);
            assert(_.isPlainObject(res.body.data[0]));
            assert(res.body.data[0].firstname, profile.firstname);
            assert(res.body.data[0].lastname, profile.lastname);
        }).then(function(){
            done();
        }).catch(function(err){
            done(err);
        });
    });

    // ==========================================================================
    // We create a todo_ in the default todolost
    // ==========================================================================
    it('Should update', function(done){
        co(function *() {
            var res = yield request
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

            assert(typeof res.body, 'object');
            assert(res.body.success, true);
            assert(_.isArray(res.body.data));
            assert(res.body.data.length, 1);
            assert(typeof res.body.data[0], 'object');
            assert(res.body.data[0].firstname, 'cat');
            assert(res.body.data[0].lastname, 'dog');
            assert(res.body.data[0].salutation, 'mr');

        }).then(function(){
            done();
        }).catch(function(err){
            done(err);
        });
    });
});
