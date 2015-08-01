const config = require('../../config');

/**
 * Base Mail Class
 */
export class BaseMail {

    constructor () {
        this.from = config.WU_MAIL_FROM;
    }
}
