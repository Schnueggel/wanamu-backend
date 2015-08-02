'use strict';

import { BaseMail } from '../BaseMail.js';

import jade from 'jade';

// =============================================================================================
// We need to compile the templates only once.
// =============================================================================================
const textJadeFunction = jade.compileFile(__dirname + '/template.txt.jade');
const htmlJadeFunction = jade.compileFile(__dirname + '/template.html.jade');

/**
 * FriendInviteMail
 * @namespace services.mail.FriendInviteMail
 */
export default class FriendInviteMail extends BaseMail {

    /**
     *
     * @param {string} acceptlink
     * @param {User} inviter
     * @param {User} invited
     */
    constructor (acceptlink, inviter, invited) {
        super(textJadeFunction, htmlJadeFunction);
        this.inviter = inviter;
        this.invited = invited;

        // =============================================================================================
        // TODO translate
        // =============================================================================================
        this.subject = 'Wanamu friendship invitiation';
        this.to = '';

        this.acceptlink = acceptlink;
    }
}
