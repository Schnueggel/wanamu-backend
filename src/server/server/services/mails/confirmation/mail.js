var templatehtml = require('./template.html');
var templatetxt = require('./template.txt');

function ConfirmationMail () {
    this.text = templatetxt;
    this.html = templatehtml;
    this.subject = 'Wanamu registration confirmation';
    this.from = '';
    this.to = ''
}

ConfirmationMail.prototype.setConfirmationLink = function(link) {
    this.text = this.text.replace('${confirmationlink}', link);
    this.html = this.html.replace('${confirmationlink}', link);
    return this;
};


module.exports = ConfirmationMail;
