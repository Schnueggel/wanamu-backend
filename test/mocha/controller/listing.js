'use strict';
/**
 * Created by Christian on 5/2/2015.
 */
var assert = require('assert'),
    ListingController = require('../../../dist/server/server/controller/Listing'),
    listingModel = require('../../../dist/server/server/model/Listing');

describe('Get Listing Controller Class', function () {
    it('Should have a function named get and list', function () {
        assert.equal(typeof ListingController, 'function');
        var lc = new ListingController(listingModel);
        assert.equal(typeof lc, 'object');
        assert.equal(typeof lc.list, 'function');
        assert.equal(typeof lc.get, 'function');
    });
});
