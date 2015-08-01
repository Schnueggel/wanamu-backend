
let nodemailer = require('nodemailer');
let config = require('../config');

module.exports = nodemailer.createTransport( config.mailerTransportConfig );
