var request = require('../../../dist/server/server/config/mocha').request,
    app = require('../../../dist/server/server.js'),
    assert = require('assert'), co = require('co'),
    should = require('should'),
    _ = require('lodash');


describe('Test Setting Controller', function () {

    var setting;
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

            res.body.should.be.an.instanceOf(Object);
            assert(res.body.success, true);
            assert(_.isArray(res.body.data));
            assert(res.body.data.length, 1);
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

            assert(typeof res.body, 'object');
            assert(res.body.success, true);
            assert(_.isArray(res.body.data));
            assert(res.body.data.length, 1);
            assert(typeof res.body.data[0], 'object');
            assert(res.body.data[0].color1, 'color1');

        }).then(function(){
            done();
        }).catch(function(err){
            done(err);
        });
    });
});
