import mailer from '../config/mailer';
import ConfirmationMail from './mails/confirmation/mail';
import ConfirmationSuccessMail  from './mails/confirmationsuccess/mail';
import FriendInviteMail  from './mails/friendinvite/mail';
import config from '../config';
import errors from '../util/error';

export class MailService {

    /**
     *
     * @param {User} user
     * @param {RegistrationController} registration
     */
    sendConfirmationMail(user, registration) {
        const mail = new ConfirmationMail(config.getConfirmationUrl(registration.confirmhash));
        mail.to = user.email;

        return this.sendMail(mail);
    }

    /**
     *
     * @param {string} email
     * @param profile
     * @returns {Promise}
     */
    sendConfirmationSuccessMail(email, profile) {
        const mail = new ConfirmationSuccessMail(profile, config.getWebhomeUrl());
        mail.to = email;
        return this.sendMail(mail);
    }

    /**
     *
     * @param inviter
     * @param invited
     * @returns {Promise}
     */
    sendFriendInvitationMail(token, inviter, invited) {
        const mail = new FriendInviteMail(config.getAcceptFriendInviteUrl(token), inviter, invited);
        mail.to = invited.email;
        return this.sendMail(mail);
    }

    /**
     * sends a mail
     * @param mail
     * @returns {Promise}
     */
    sendMail(mail) {
        let reject;
        let resolve;

        const promise = new Promise(function (res, rej) {
            resolve = res;
            reject = rej;
        });

        mailer.sendMail(mail, (err, info) => {
            if (err) {
                reject(new errors.ServerError('Unable to create confirmation mail'));
                console.error(err);
            } else {
                resolve(info);
            }
        });
        return promise;
    }

}
const mailService = new MailService();

export default mailService;
