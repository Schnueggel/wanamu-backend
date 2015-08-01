const fs = require('fs');
const templatehtml = fs.readFileSync(__dirname + '/template.html').toString();
const templatetxt = fs.readFileSync(__dirname + '/template.txt').toString();

import { BaseMail } from '../BaseMail.js';

export class ConfirmationMail extends BaseMail {

    constructor () {
        super();
        this.text = templatetxt;
        this.html = templatehtml;
        this.subject = 'Wanamu registration confirmation';
        this.to = '';
    }
    setConfirmationLink(link) {
        this.text = this.text.replace('${confirmationlink}', link);
        this.html = this.html.replace('${confirmationlink}', link);
        return this;
    }
}
