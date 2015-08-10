var request = require('../../../dist/server/server/config/mocha').request,
    app = require('../../../dist/server/server.js'),
    config = require('../../../dist/server/server/config'),
    assert = require('assert'),
    co = require('co'),
    databasehelper = require('../../../dist/server/server/setup/databasehelper'),
    should = require('should'),
    _ = require('lodash');


describe('Test Setting Controller', function () {

    var setting;
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
            assert(_.isPlainObject(res.body.data[0].Setting));
            assert( _.isNumber(res.body.data[0].Setting.id));

            setting = res.body.data[0].Setting;
        }).then(function(){
            done();
        }).catch(function(err){
            done(err);
        });
    });


    it('Should get setting', function(done){
        assert(_.isPlainObject(setting));

        co(function *() {
            var res = yield request
                .get('/setting/' + setting.id)
                .type('json')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end();

            res.body.should.be.an.Object;
            res.body.success.should.be.true
            res.body.data.should.be.an.Array
           res.body.data.should.have.length(1)
            assert(_.isPlainObject(res.body.data[0]));
            should(res.body.data[0].color1).be.exactly(setting.color1);
            should(res.body.data[0].color2).be.exactly(setting.color2);
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

            res.body.should.be.an.Object
            res.body.success.should.be.true
            res.body.data.should.be.an.Array
           res.body.data.should.have.length(1)
            res.body.data.should.be.an.Object
            assert(res.body.data[0].color1, 'color1');

        }).then(function(){
            done();
        }).catch(function(err){
            done(err);
        });
    });
});
