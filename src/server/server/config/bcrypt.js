/**
 * Created by Christian on 5/16/2015.
 */
var bcrypt = require('bcryptjs');

var bc;

module.exports = bc = {
    /**
     *
     * @param passwordCandidate
     * @param userPassword
     */
    compare: function (passwordCandidate, userPassword) {
        return new Promise(function(resolve, reject){
            bcrypt.compare(passwordCandidate, userPassword, function (err, isMatch) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(isMatch);
            });
        });
    },
    salt : function(){
        return new Promise(function (resolve, reject) {
            bcrypt.genSalt(10, function (err, salt) {
                if (err) { reject(err); } else { resolve(salt); }
            });
        });
    },
    hash : function(password, salt){
        return new Promise(function (resolve, reject) {
            bcrypt.hash(password, salt, function(err, hash) {
                if (err) { reject(err); } else { resolve(hash); }
            });
        });
    },
    hashAndSalt: function* (password) {
        var salt = yield bc.salt();
        return yield bc.hash(password, salt);
    }
};
