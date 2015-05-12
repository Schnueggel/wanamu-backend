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
    });
});


function* testCreateListing(){
    var usergroup = yield UserGroup.find({where:{name:'private'}});

    assert(typeof usergroup, 'object', 'A');
    assert(usergroup.name, 'private' ,'B');

    var user = yield User.find(1);

    assert(typeof user, 'object', 'C');

    var listing = yield Listing.create({
        title: 'Model Test',
        userId: user.id
    });

    assert(typeof listing.id, 'number', 'Listing ID is not a number');
    assert(listing.userId, user.get('id'), 'Listing userId and User.id do not match');
}
