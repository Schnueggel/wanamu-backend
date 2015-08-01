const fs = require('fs');
const templatehtml = fs.readFileSync(__dirname + '/template.html').toString();
const templatetxt = fs.readFileSync(__dirname + '/template.txt').toString();

import { BaseMail } from '../BaseMail.js';

export class ConfirmationSuccessMail extends BaseMail {

    constructor() {
        super();
        this.text = templatetxt;
        this.html = templatehtml;
        this.subject = '${firstname} ${lastname} Welcome to wanamu';
        this.to = '';
    }

    /**
     *
     * @param {Profile} user
     * @returns {ConfirmationSuccessMail}
     */
    setProfile(profile) {
        this.text = this.text.replace('${firstname}', profile.firstname)
            .replace('${salutation}', profile.salutation)
            .replace('${lastname}', profile.lastname);

        this.html = this.html.replace('${firstname}', profile.firstname)
            .replace('${salutation}', profile.salutation)
            .replace('${lastname}', profile.lastname);

        this.subject = this.subject.replace('${firstname}', profile.salutation)
            .replace('${lastname}', profile.lastname);

        return this;
    }

    /**
     *
     * @param {User} user
     * @returns {ConfirmationSuccessMail}
     */
    setHomeLink(link) {

        this.text = this.text.replace('${homelink}', link);

        this.html = this.html.replace('${homelink}', link);
        return this;
    }
}
