var request = require('../../../dist/server/server/config/mocha').request,
    app = require('../../../dist/server/server.js'),
    config = require('../../../dist/server/server/config'),
    databasehelper = require('../../../dist/server/server/setup/databasehelper'),
    should = require('should'),
    assert = require('assert'),
    co = require('co'),
    _ = require('lodash');


describe('Test Profile Controller', function () {

    var profile;
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
            var user = yield databasehelper.createUser();
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

            res.body.success.should.be.true
            assert(_.isPlainObject(res.body));
            res.body.data.should.be.an.Array
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
            res.body.success.should.be.true
            res.body.data.should.be.an.Array
            res.body.data.should.have.length(1)
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

            res.body.should.be.an.Object
            res.body.success.should.be.true
            res.body.data.should.be.an.Array
            res.body.data.should.have.length(1)
            res.body.data.should.be.an.Object
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
