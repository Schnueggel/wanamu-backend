/**
 * Created by Schnueggel on 05.07.2015.
 */
let mailer = require('../config/mailer');
let ConfirmationMail = require('./mails/confirmation/mail');
let ConfirmationSuccessMail = require('./mails/confirmationsuccess/mail');
let config = require ('../config');
let errors = require('../util/error');

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
    let mail = new ConfirmationMail();
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
    let mail = new ConfirmationSuccessMail();
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
    let reject;
    let resolve;

    let promise = new Promise(function(res, rej){
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
