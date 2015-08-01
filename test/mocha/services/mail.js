var config = require('../../../dist/server/server/config'),
    ConfirmationMail = require('../../../dist/server/server/services/mails/confirmation/mail.js'),
    ConfirmationSuccessMail = require('../../../dist/server/server/services/mails/confirmationsuccess/mail.js'),
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

        console.log(mail.text);
    });
});
