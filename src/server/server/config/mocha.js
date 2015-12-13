import config from '../config';
export const request = require('co-supertest').agent('http://localhost:' + config.get('port'));

