'use strict';
/**
 * Created by Christian on 5/6/2015.
 */
var assert = require('assert'),
    Todo = require('../../../dist/server/server/model/todo.js'),
    User =  require('../../../dist/server/server/model/user.js'),
    ErrorUtil = require('../../../dist/server/server/util/error.js'),
    co = require('co');


describe('Test Todo Model', function () {

    it('Should create Todo', function (done) {
        assert.equal(typeof Todo, 'object');
        assert.equal(typeof User, 'object');

        co(testCreateTodo).then(function(){
            done();
        }).catch(function(err){
            console.error(err);
            done(err);
        });
    });
});

/**
 * Test TodoCreation
 */
function* testCreateTodo(){

}
