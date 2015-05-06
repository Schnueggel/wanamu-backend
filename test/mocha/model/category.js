'use strict';
/**
 * Created by Christian on 5/6/2015.
 */
var assert = require('assert'),
    Category = require('../../../src/server/server/model/category');


describe('Get Category Model', function () {

    it('Should find Category with id 1', function (done) {
        assert.equal(typeof Category, 'object');
        Category.find(1).then(function(res){
            assert.equal(typeof res, 'object');
            assert.equal(res.id, 1);
            done();
        }).catch(function(err){
            throw err;
        });
    });
    it('Category 3 should have parent 1', function (done) {
        assert.equal(typeof Category, 'object');
        Category.find({
            where: {
                id: 3
            },
            include : [{ all: true, nested: true }]
        }).then(function(res){
            assert.equal(typeof res, 'object');
            console.log(res);
            assert.equal(res.parent, 1);
            done();
        }).catch(function(err){
            throw err;
        });
    });
});
