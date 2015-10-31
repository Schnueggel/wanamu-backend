
const nodemailer = require('nodemailer'),
    config = require('../config');

module.exports = nodemailer.createTransport( config.mailerTransportConfig );
