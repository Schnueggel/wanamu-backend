
var nodemailer = require('nodemailer');
var config = require('../config');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport( config.get('mail') );


module.exports = transporter;
