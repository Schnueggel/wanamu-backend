/**
 * Created by Christian on 5/25/2015.
 */
var config = require('../config'),
    request = require('co-supertest').agent('http://localhost:' + config.get('port'));


module.exports = {
    request: request
};
