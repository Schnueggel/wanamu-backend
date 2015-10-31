const config = require('../config'),
    request = require('co-supertest').agent('http://localhost:' + config.get('port'));

module.exports = {
    request: request
};
