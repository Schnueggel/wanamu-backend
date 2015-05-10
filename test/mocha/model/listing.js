'use strict';
/**
 * Created by Christian on 5/6/2015.
 */
var assert = require('assert'),
    Listing = require('../../../dist/server/server/model/listing'),
    User = require('../../../dist/server/server/model/user'),
    UserGroup = require('../../../dist/server/server/model/user-group'),
    co = require('co');


describe('Test Listing Model', function () {

    it('Should create Listing with ID 1', function (done) {
        assert.equal(typeof Listing, 'object');
        assert.equal(typeof User, 'object');
        assert.equal(typeof UserGroup, 'object');


        co(testCreateListing).then(function(){
            done();
        }).catch(function(err){
            console.error(err);
            done();
        });

        //UserGroup.find({where:{name:'private'}}).then(function(result){
        //    assert(typeof result, 'object');
        //    assert(result.name, 'private');
        //    return result;
        //}).then(function(result){
        //    User.create({
        //        email: 'test@email.de',
        //        firstName: 'firstName',
        //        lastName: 'lastName',
        //        password: 'abcdef',
        //        userGroup: result.id
        //    }).then(function(user){
        //        Listing.create({
        //            user: user.id
        //        }).then(function(listing){
        //            console.log('Listing created');
        //            assert(typeof listing.id, 'number', 'Listing ID is not a number');
        //            done();
        //        }).catch(function(err){
        //            console.error(err);
        //            done();
        //        });
        //    }).catch(function(err){
        //        console.error(err);
        //        done();
        //    });
        //}).catch(function(err){
        //    console.error(err);
        //    done();
        //});

    });
});


function* testCreateListing(){
    var usergroup = yield UserGroup.find({where:{name:'private'}});

    assert(typeof usergroup, 'object');
    assert(usergroup.name, 'private');

    var user = yield User.create({
        email: 'test@email.de',
        firstName: 'firstName',
        lastName: 'lastName',
        password: 'abcdef',
        userGroup: usergroup.id
    });

    var listing = yield Listing.create({
        user: user.id
    });

    assert(typeof listing.id, 'number', 'Listing ID is not a number');
    assert(listing.user, user.id);
}
