'use strict';

/**
 * Created by Christian on 5/10/2015.
 */
var assert = require('assert'),
    Listing = require('../../../dist/server/server/model/listing'),
    User = require('../../../dist/server/server/model/user'),
    UserGroup = require('../../../dist/server/server/model/user-group'),
    co = require('co');


describe('Test Node Generators', function () {

    it('Should yield promises', function (done) {
        assert.equal(typeof Listing, 'object');
        assert.equal(typeof User, 'object');
        assert.equal(typeof UserGroup, 'object');

        co(test).then(function(){
           done();
        }).catch(function(err){
            console.log(err);
            done();
        });

    });
});

function* test() {
    var val1 = yield UserGroup.find(1);
    console.log('generator step 1');
    var val2 = yield Listing.find(1);
    console.log('generator works');
}
