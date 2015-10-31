import config from '../../../dist/server/server/config';
import ConfirmationMail from '../../../dist/server/server/services/mails/confirmation/mail';
import ConfirmationSuccessMail from '../../../dist/server/server/services/mails/confirmationsuccess/mail.js';
import FriendInviteMail from '../../../dist/server/server/services/mails/friendinvite/mail.js';
import should from 'should';
import  _  from 'lodash';

describe ('Test mail service', () => {

    it('should generate a valid confirmation mail', () => {
        const mail = new ConfirmationMail('http://testconfirmationlink');
        mail.text.should.match(/http:\/\/testconfirmationlink/mi);
        mail.html.should.match(/http:\/\/testconfirmationlink/mi)
    });

    it('should generate a valid confirmationsuccess mail', () => {
        const profile = {
            firstname: 'TestFirstname',
            lastname: 'TestLastname',
            salutation: 'Mr.'
        };

        const mail = new ConfirmationSuccessMail(profile, 'http://homelink');

        mail.text.should.match(/TestFirstname/mi);
        mail.text.should.match(/Mr\./mi);
        mail.text.should.match(/TestLastname/mi);
        mail.text.should.match(/http:\/\/homelink/mi);

        mail.html.should.match(/TestFirstname/mi);
        mail.html.should.match(/Mr\./mi);
        mail.html.should.match(/TestLastname/mi);
        mail.html.should.match(/http:\/\/homelink/mi);

        mail.subject.should.match(/TestFirstname/mi);
        mail.subject.should.match(/TestLastname/mi);

    });

    it('should generate a valid friendship accept mail', () => {
        const inviter = {
            Profile: {
                firstname: 'InviterFirstname',
                lastname: 'InviterLastname',
                salutation: 'Mr.'
            }
        };

        const invited = {
            Profile: {
                firstname: 'InvitedFirstname',
                lastname: 'InvitedLastname',
                salutation: 'Mrs.'
            }
        };

        const mail = new FriendInviteMail('http://homelink', inviter, invited);

        mail.text.should.match(/InviterFirstname/mi);
        mail.text.should.match(/Mr\./mi);
        mail.text.should.match(/InviterLastname/mi);
        mail.text.should.match(/http:\/\/homelink/mi);

        mail.text.should.match(/InvitedFirstname/mi);
        mail.text.should.match(/Mrs\./mi);
        mail.text.should.match(/InvitedLastname/mi);


        mail.html.should.match(/InviterFirstname/mi);
        mail.html.should.match(/Mr\./mi);
        mail.html.should.match(/InviterLastname/mi);
        mail.html.should.match(/http:\/\/homelink/mi);

        mail.html.should.match(/InvitedFirstname/mi);
        mail.html.should.match(/Mr\./mi);
        mail.html.should.match(/InvitedLastname/mi);
        mail.html.should.match(/http:\/\/homelink/mi);
    });

});
