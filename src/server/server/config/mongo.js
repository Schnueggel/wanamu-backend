/**
 * Created by Christian on 5/14/2015.
 */

var monk = require('monk');
var config = require('../config');

var db = monk(config.get('mongo').url);

module.exports = db;
