
let nodemailer = require('nodemailer');
let config = require('../config');

// create reusable transporter object using SMTP transport
let transporter = nodemailer.createTransport( config.get('mail') );


module.exports = transporter;
