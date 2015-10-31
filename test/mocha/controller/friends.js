import mocha from '../../../dist/server/server/config/mocha';
import app from '../../../dist/server/server.js';
import config from '../../../dist/server/server/config';
import Profile from '../../../dist/server/server/model/profile';
import User from '../../../dist/server/server/model/user';
import co from 'co';
import databasehelper from '../../../dist/server/server/setup/databasehelper';
import should from 'should';
import _ from 'lodash';


describe('Test Friends Controller', () => {

    let user, friend1, friend2, newfriend;

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
    after(function (done) {
        app.server.close(done);
    });

    // =============================================================================================
    // Create User with friends
    // =============================================================================================
    it('Should create Users', (done) => {
        co(function *() {
            user = yield databasehelper.createUser();

            friend1 = yield databasehelper.createUser();
            friend2 = yield databasehelper.createUser();

            yield user.addFriend(friend1, {accepted: true});
            yield user.addFriend(friend2, {accepted: true});

            const friends = yield user.getFriends({
                include: [
                    {
                        model: Profile,
                        attributes: ['firstname', 'lastname']
                    }
                ],
                attributes: ['id']
            });

            friends.should.be.an.instanceOf(Array);
            friends.length.should.be.exactly(2);
            return null;
        }).then(done).catch(done);
    });

    // ==========================================================================
    // Login with the created user
    // ==========================================================================
    it('Should login', (done) => {
        co(function *() {
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
            res.body.should.be.an.Object;
            res.body.data.should.be.an.Array;
            return null;
        }).then(done).catch(done);
    });


    // ==========================================================================
    // Login with the created user
    // ==========================================================================
    it('Should list friends', (done) => {
        co(function *() {
            const res = yield mocha.request
                .get('/friend')
                .type('json')
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
            res.body.data[0].Friends.should.have.properties('updatedAt', 'accepted');
            res.body.data[0].Friends.should.be.type('object');
            res.body.data[0].Friends.accepted.should.be.true;
            res.body.data[0].Profile.should.be.type('object');
            res.body.data[0].Profile.should.have.properties('id', 'firstname', 'lastname');

            return null;
        }).then(done).catch(done);
    });

    // ==========================================================================
    // Add Friend
    // ==========================================================================
    it('Should invite a user', (done) => {

        co(function *() {
            newfriend = yield databasehelper.createUser();

            const res = yield mocha.request
                .post('/friend')
                .type('json')
                .send({
                    data: {
                        email: newfriend.email
                    }
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end();

            res.body.should.be.type('object');
            res.body.success.should.be.true;

            const frienddata = yield user.getFriends({
                where: {
                    id: newfriend.id
                }
            });

            frienddata.should.be.an.Array;
            frienddata.should.have.length(1);
            frienddata[0].id.should.equal(newfriend.id);
            frienddata[0].Friends.accepted.should.be.false;
            frienddata[0].Friends.accepttoken.should.be.a.String;
            frienddata[0].Friends.accepttoken.should.have.length(64);
            return null;
        }).then(done).catch(done);
    });

    // ==========================================================================
    // Test is friend was added
    // ==========================================================================
    it('Should have a new friend', (done) => {
        co(function *() {
            const res = yield mocha.request
                .get('/friend')
                .type('json')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end();

            res.body.should.be.an.Object;
            res.body.success.should.be.true;
            res.body.data.should.have.length(3);
            res.body.data.should.be.instanceof(Array);
            res.body.data[2].should.be.type('object');
            res.body.data[2].should.have.properties('id', 'Friends');
            res.body.data[2].id.should.be.a.Number;
            res.body.data[2].Friends.should.have.properties('updatedAt', 'accepted');
            res.body.data.should.containDeep([{id: newfriend.id, Friends: {accepted: false}}]);

            return null;
        }).then(done).catch(done);
    });
    // ==========================================================================
    // Add Friend and auto accept Friendship
    // ==========================================================================
    it('Should add a friends', (done) => {

        co(function *() {

            yield mocha.request
                .post('/auth/login')
                .type('form')
                .send({
                    username: newfriend.email,
                    password: databasehelper.DEFAULT_PASSWORD
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end();

            const res = yield mocha.request
                .post('/friend')
                .type('json')
                .send({
                    data: {
                        email: user.email
                    }
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(226)
                .end();

            res.body.should.be.an.Object;
            res.body.success.should.be.true;
            res.body.message.should.be.a.String;
            return null;
        }).then(done).catch(done);
    });

    // ==========================================================================
    // Test is friend was added
    // ==========================================================================
    it('Should accept friend', (done) => {
        co(function *() {

            yield mocha.request
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

            const newacceptfriend = yield databasehelper.createUser();

            const token = 'testoken_newacceptfriend';
            yield user.addFriend(newacceptfriend, {accepttoken: token});

            const res = yield mocha.request
                .get('/acceptfriend/' + token)
                .type('json')
                .set('Accept', 'application/json')
                .expect(200)
                .expect('Content-Type', /json/)
                .end();

            res.body.should.be.an.Object;
            res.body.success.should.be.true;

            const frienddata = yield user.getFriends({
                where: {
                    id: newacceptfriend.id
                }
            });

            frienddata.should.be.an.Array;
            frienddata.should.have.length(1);
            frienddata[0].id.should.equal(newacceptfriend.id);
            frienddata[0].Friends.accepted.should.be.true;
            frienddata[0].Friends.accepttoken.should.be.a.String;
            frienddata[0].Friends.accepttoken.should.have.length(token.length);

            return null;
        }).then(done).catch(done);
    });

    // ==========================================================================
    // Test is friend was added
    // ==========================================================================
    it('Should remove friend', (done) => {
        co(function *() {

            yield mocha.request
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


            const res = yield mocha.request
                .delete('/friend/' + newfriend.id)
                .type('json')
                .set('Accept', 'application/json')
                .expect(200)
                .expect('Content-Type', /json/)
                .end();

            res.body.should.be.an.Object;
            res.body.success.should.be.true;

            const frienddata = yield user.getFriends({
                where: {
                    id: newfriend.id
                }
            });

            frienddata.should.be.an.Array;
            frienddata.should.have.length(0);

            return null;
        }).then(done).catch(done);
    });
});
