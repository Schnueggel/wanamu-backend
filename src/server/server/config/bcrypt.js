/**
 * Created by Christian on 5/16/2015.
 */
var bcrypt = require('bcryptjs');
var _ = require('lodash');
var bc;

module.exports = bc = {
    /**
     *
     * @param passwordCandidate
     * @param userPassword
     */
    compare: function (passwordCandidate, userPassword) {
        return new Promise(function(resolve, reject){
            bcrypt.compare(passwordCandidate, userPassword.toString(), function (err, isMatch) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(isMatch);
            });
        });
    },
    salt : function(num){
        num = _.isNumber(num) ?  num : 10;
        return new Promise(function (resolve, reject) {
            bcrypt.genSalt(num, function (err, salt) {
                if (err) {
                    reject(err);
                    console.error(err.stack);
                } else {
                    resolve(salt);
                }
            });
        });
    },
    /**
     *
     * @param {string} password
     * @param {string} salt
     * @returns {Promise}
     */
    hash : function(password, salt){
        return new Promise(function (resolve, reject) {
            bcrypt.hash(password, salt, function(err, hash) {
                if (err) {
                    reject(err);
                    console.error(err.stack);
                } else {
                    resolve(hash);
                }
            });
        });
    },
    hashAndSalt: function* (password, rounds) {
        var salt = yield bc.salt(rounds);
        return yield bc.hash(password, salt);
    }
};
