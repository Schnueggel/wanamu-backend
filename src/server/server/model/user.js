/**
 * Created by Christian on 5/15/2015.
 */

var mongo = require('../config/mongo.js')
    wrap = require('co-monk');

var users = wrap(db.get('users'));

module.exports = users;
