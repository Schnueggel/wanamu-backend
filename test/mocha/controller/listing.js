'use strict';
/**
 * Created by Christian on 5/2/2015.
 */
var assert = require('assert'),
    listing = require('../../../src/server/server/controller/listing');


describe('Get Listing Controller Object', function () {
    it('Should have a function named get and list', function () {
        assert.equal(typeof listing.get, 'function');
        assert.equal(typeof listing.list, 'function');
    });
});
