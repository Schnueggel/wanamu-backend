'use strict';

import { BaseMail } from '../BaseMail.js';

import jade from 'jade';

// =============================================================================================
// We need to compile the templates only once.
// =============================================================================================
const textJadeFunction = jade.compileFile(__dirname + '/template.txt.jade');
const htmlJadeFunction = jade.compileFile(__dirname + '/template.html.jade');

/**
 * Confirmation Mail
 * @namespace services.mail
 */
export default class ConfirmationMail extends BaseMail {

    constructor (confirmationlink) {
        super(textJadeFunction, htmlJadeFunction);
        // =============================================================================================
        // TODO translate
        // =============================================================================================
        this.subject = 'Wanamu registration confirmation';
        this.to = '';

        this.confirmationlink = confirmationlink;
    }
}
