let config = require('../config'),
    request = require('co-supertest').agent('http://localhost:' + config.get('port'));

module.exports = {
    request: request,
    doneGood: (done) => {
        return () => {
            done();
        };
    },
    doneErr: (done) => {
        return (err) => {
            if (err) {
                done(err);
            } else {
                done();
            }
        };
    }
};
