var fs = require('fs');

var templatehtml = fs.readFileSync(__dirname + '/template.html').toString();
var templatetxt = fs.readFileSync(__dirname + '/template.txt').toString();

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
