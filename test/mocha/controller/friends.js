var request = require('../../../dist/server/server/config/mocha').request,
    app = require('../../../dist/server/server.js'),
    config = require('../../../dist/server/server/config'),
    Profile = require('../../../dist/server/server/model/profile'),
    User = require('../../../dist/server/server/model/user'),
    assert = require('assert'), co = require('co'),
    should = require('should'),
    _ = require('lodash');


describe('Test Friends Controller', function () {

    var user;
    var friend1;
    var friend2;

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

    // =============================================================================================
    // Create User with friends
    // =============================================================================================
    it('Should create Users', function(done){
        co(function *() {
            user = yield User.create({
                email : 'frienduser@email.de',
                confirmed: 1,
                password: 'abcdefghijk'
            }, { isNewRecord: true});


            friend1 = yield User.create({
                email : 'friend1@email.de',
                confirmed: 1,
                password: 'abcdefghijk'
            }, { isNewRecord: true});

            var profile1 = yield Profile.create({
                UserId: friend1.id,
                salutation: 'mr',
                firstname: 'friend1',
                lastname: 'friend1'
            });

            friend2 = yield User.create({
                email : 'friend2@email.de',
                confirmed: 1,
                password: 'abcdefghijk'
            }, { isNewRecord: true});

            var profile2 = yield Profile.create({
                UserId: friend2.id,
                salutation: 'mr',
                firstname: 'friend1',
                lastname: 'friend1'
            });

            yield user.addFriend(friend1, {accepted: true});
            yield user.addFriend(friend2, {accepted: true});

            yield user.reload();

            var friends = yield user.getFriends({
                include: [
                    {
                        model: Profile,
                        attributes:[ 'firstname', 'lastname' ]
                    }
                ],
                attributes: ['id']
            });

            friends.should.be.an.instanceOf(Array);
           (friends.length).should.be.exactly(2);
            return null;
        }).then(function(){
            done();
        }).catch(function(err){
            done(err);
        });
    });

    // ==========================================================================
    // Login with the created user
    // ==========================================================================
    it('Should login', function(done){
        co(function *() {
            var res = yield request
                .post('/auth/login')
                .type('form')
                .send({
                    username: user.email,
                    password: 'abcdefghijk'
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end();

            assert(res.body.success);
            assert(_.isPlainObject(res.body));
            assert(_.isArray(res.body.data));
            (res.body.data[0].Profile === null).should.be.true;
            return null;
        }).then(function(){
            done();
        }).catch(function(err){
            done(err);
        });
    });


    // ==========================================================================
    // Login with the created user
    // ==========================================================================
    it('Should list friends', function(done){
        co(function *() {
            var res = yield request
                .get('/friends')
                .type('json')
                .send({
                    username: user.email,
                    password: 'abcdefghijk'
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end();

            res.body.should.be.type('object');
            res.body.success.should.be.true;
            res.body.data.should.have.length(2);
            res.body.data.should.be.instanceof(Array);
            res.body.data[0].should.be.type('object');
            res.body.data[0].should.have.properties('id', 'Friends');
            res.body.data[0].id.should.be.a.Number;
            res.body.data[0].Friends.should.have.properties('FriendId', 'accepted');
            res.body.data[0].Friends.should.be.type('object');
            res.body.data[0].Friends.accepted.should.be.true;
            res.body.data[0].Profile.should.be.type('object');
            res.body.data[0].Profile.should.have.properties('id', 'firstname', 'lastname');

            return null;
        }).then(function(){
            done();
        }).catch(function(err){
            done(err);
        });
    });

});
