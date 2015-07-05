/**
 * Created by Schnueggel on 05.07.2015.
 */
var mailer = require('../config/mailer');
var ConfirmationMail = require('./mails/confirmation/mail');
var ConfirmationSuccessMail = require('./mails/confirmationsuccess/mail');
var config = require ('../config');
var errors = require('../util/error');

/**
 *
 * @constructor
 */
function MailService () {

}

/**
 *
 * @param {User} user
 * @param {Registration} registration
 */
MailService.prototype.sendConfirmationMail = function(user, registration) {
    var mail = new ConfirmationMail();
    mail.setConfirmationLink(config.getConfirmationUrl(registration.confirmhash));
    mail.to = user.email;
    return this.sendMail(mail);
};

/**
 *
 * @param {string} email
 * @param profile
 * @returns {Promise}
 */
MailService.prototype.sendConfirmationSuccessMail = function(email, profile) {
    var mail = new ConfirmationSuccessMail();
    mail.setProfile(profile);
    mail.setHomeLink(config.getWebhomeUrl());
    mail.to = email;
    return this.sendMail(mail);
};

/**
 * sends a mail
 * @param mail
 * @returns {Promise}
 */
MailService.prototype.sendMail = function(mail){
    var reject;
    var resolve;

    var promise = new Promise(function(res, rej){
        resolve = res;
        reject = rej;
    });

    mailer.sendMail(mail, function(err, info) {
        if (err) {
            reject(new errors.ServerError('Unable to create confirmation mail'));
            console.error(err);
        } else {
            resolve(info);
        }
    });
    return promise;
};

module.exports = new MailService();
