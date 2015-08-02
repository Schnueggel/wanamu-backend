var config = require('../../../dist/server/server/config'),
    ConfirmationMail = require('../../../dist/server/server/services/mails/confirmation/mail.js'),
    ConfirmationSuccessMail = require('../../../dist/server/server/services/mails/confirmationsuccess/mail.js'),
    FriendInviteMail = require('../../../dist/server/server/services/mails/friendinvite/mail.js'),
    should = require('should'),
    _ = require('lodash');

describe ('Test mail service', function() {

    it('should generate a valid confirmation mail', function(){
        var mail = new ConfirmationMail('http://testconfirmationlink');
        mail.text.should.match(/http:\/\/testconfirmationlink/mi);
        mail.html.should.match(/http:\/\/testconfirmationlink/mi)
    });

    it('should generate a valid confirmationsuccess mail', function(){
        var profile = {
            firstname: 'TestFirstname',
            lastname: 'TestLastname',
            salutation: 'Mr.'
        };

        var mail = new ConfirmationSuccessMail(profile, 'http://homelink');

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

    it('should generate a valid friendship accept mail', function(){
        var inviter = {
            Profile: {
                firstname: 'InviterFirstname',
                lastname: 'InviterLastname',
                salutation: 'Mr.'
            }
        };

        var invited = {
            Profile: {
                firstname: 'InvitedFirstname',
                lastname: 'InvitedLastname',
                salutation: 'Mrs.'
            }
        };

        var mail = new FriendInviteMail('http://homelink', inviter, invited);

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
