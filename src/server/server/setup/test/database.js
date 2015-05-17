/**
 * Created by Christian on 5/17/2015.
 */
// ==========================================================================
// Delete config from cache to reload it in case NODE_ENV has change
// ==========================================================================
delete require.cache[require.resolve('../../config/index.js')];

var mongo = require('../../config/mongo.js'),
    User = null,
    co = require('co');

module.exports = function(cb) {
    mongo.get('users').drop(function(){
        User = require('../../model/user.js');
        co(setup).then(function(){
            cb();
        }).catch(function(err){
            cb();
            console.error(err);
            throw err;
        });
    });
};

function* setup() {
    yield User.create({
        _id: '555907c34f7de3fc25171ed2',
        email: 'test@email.de',
        password: 'abcdefghijk',
        firstname: 'firstname',
        lastname: 'lastname',
        salutation: User.SALUTATION_MR
    });
}
