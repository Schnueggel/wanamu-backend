var mochaconf =  require('../../../dist/server/server/config/mocha'),
    request = mochaconf.request,
    app = require('../../../dist/server/server.js'),
    config = require('../../../dist/server/server/config'),
    User = require('../../../dist/server/server/model/user'),
    supertest = require('co-supertest'),
    should = require('should'),
    databasehelper = require('../../../dist/server/server/setup/databasehelper'),
    co = require('co'),
    _ = require('lodash');

describe('Test User Controller', function () {

    var userid;
    // ==========================================================================
    // Before test we start the server
    // ==========================================================================
    before(function (done) {
        co(function*() {
            yield databasehelper.truncateDatabase();
            yield app.init();
        }).then(mochaconf.doneGood(done)).catch(mochaconf.doneErr(done));
    });

    // ==========================================================================
    // After each test we end the server
    // ==========================================================================
    after(function (done) {
        app.server.close(done);
    });

    it('Should create user', function(done){

        co(function *() {
            var res = yield request
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
        }).then(mochaconf.doneGood(done))
            .catch(mochaconf.doneErr(done));
    });

    it('Should not login', function(done){
        co(function *() {
            var res = yield request
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

        }).then(mochaconf.doneGood(done))
            .catch(mochaconf.doneErr(done));
    });

    it('Should not update user', function(done){
        userid.should.be.a.Number;

        co(function *() {
            var res = yield request
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

        }).then(mochaconf.doneGood(done)).catch(mochaconf.doneErr(done));
    });

    it('Should login', function(done){
        co(function *() {
            // =============================================================================================
            // We need to confirm the user before we can update him
            // =============================================================================================
            var user = yield User.findById(userid);
            user.confirmed = 1;
            yield user.save();

            var res = yield request
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

        }).then(mochaconf.doneGood(done)).catch(mochaconf.doneErr(done));
    });

    it('Should update user', function(done){
        userid.should.be.a.Number;

        co(function *() {
            var res = yield request
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

        }).then(mochaconf.doneGood(done)).catch(mochaconf.doneErr(done));
    });

    it('Should Get User', function (done) {
        userid.should.be.a.Number;
        co(function*(){
            var res = yield request
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
        }).then(mochaconf.doneGood(done)).catch(mochaconf.doneErr(done));
    });
});

