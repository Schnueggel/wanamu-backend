/**
 * Created by Christian on 5/15/2015.
 */

var mongo = require('../config/mongo.js'),
    bcrypt = require('../config/bcrypt.js'),
    co = require('co'),
    Error = require('../util/error.js'),
    wrap = require('co-monk');

var monkcoll =  mongo.get('users');
var users = wrap(monkcoll);

users.index('email', { unique: true });

var User = {};

User.prototype = users;


User.create = function* (input) {
    var data = input || {};


    if (!data.password || data.length < 8) {
        throw Error.INVALID_USER_PASSWORD;
    }

    var password = yield bcrypt.hashAndSalt(data.password);
    console.log(password);
    if (!password && password.length !== 60) {
        throw Error.USER_PASSWORD_NOT_CREATED;
    }
    data.password = password;

    var user = yield users.insert(data);
    console.log(user);
    return data;
};

module.exports = User;
