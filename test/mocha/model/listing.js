'use strict';
/**
 * Created by Christian on 5/6/2015.
 */
var assert = require('assert'),
    Listing = require('../../../dist/server/server/model/listing'),
    User = require('../../../dist/server/server/model/user'),
    UserGroup = require('../../../dist/server/server/model/user-group');


describe('Get Category Model', function () {

    it('Should create Listing with ID 1', function (done) {
        assert.equal(typeof Listing, 'object');
        assert.equal(typeof User, 'object');
        assert.equal(typeof UserGroup, 'object');

        UserGroup.find({where:{name:'private'}}).then(function(result){
            assert(typeof result, 'object');
            assert(result.name, 'private');
            return result;
        }).then(function(result){
            User.create({
                customerNumber: 'A10002',
                email: 'test@email.de',
                firstName: 'firstName',
                lastName: 'lastName',
                password: 'abcdef',
                userGroup: result.id
            }).then(function(user){
                console.log('Created user: ' + user.id);
                Listing.create({
                    user: user.id
                }).then(function(listing){
                    console.log('Listing created');
                    assert(typeof listing.id, 'number', 'Listing ID is not a number');
                    done();
                }).catch(function(err){
                    console.error(err);
                    done();
                });
            }).catch(function(err){
                console.error(err);
                done();
            });
        }).catch(function(err){
            console.error(err);
            done();
        });

    });
});
