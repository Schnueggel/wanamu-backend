'use strict';

import jade from 'jade';

import { BaseMail } from '../BaseMail.js';
// =============================================================================================
// We need to compile the templates only once.
// =============================================================================================
const textJadeFunction = jade.compileFile(__dirname +  '/template.txt.jade');
const htmlJadeFunction = jade.compileFile(__dirname + '/template.html.jade');

/**
 * @namespace services.mail
 */
export default class ConfirmationSuccessMail extends BaseMail {

    /**
     *
     * @param {Profile} profile
     */
    constructor(profile, homelink) {
        super(textJadeFunction, htmlJadeFunction);
        this.profile = profile;
        this.subject = '${firstname} ${lastname} Welcome to wanamu'
            .replace('${firstname}', profile.firstname)
            .replace('${lastname}', profile.lastname);

        this.to = '';
        this.homelink = homelink;
    }
}
