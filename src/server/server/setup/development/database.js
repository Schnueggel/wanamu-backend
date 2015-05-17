/**
 * Created by Christian on 5/17/2015.
 */

var mongo = require('../../config/mongo.js'),
    User = null,
    co = require('co');

module.exports = function(cb) {
    mongo.get('users').drop(function(){
        User = require('../../model/user.js');
        co(setup).then(function(){
            console.log(cb);
            cb();
        }).catch(function(err){
            throw err;
        });
    });
};

function* setup() {
    yield User.create({
        username: 'test@email.de',
        password: 'abcdefghijk'
    });
}



