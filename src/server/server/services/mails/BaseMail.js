const config = require('../../config');

/**
 * Base Mail Class
 */
export class BaseMail {

    /**
     *
     * @param {Function} textJadeFunction
     * @param {Function} htmlJadeFunction
     */
    constructor (textJadeFunction, htmlJadeFunction) {

        this.from = config.WU_MAIL_FROM;
        this.textJadeFunction = textJadeFunction;
        this.htmlJadeFunction = htmlJadeFunction;
    }

    /**
     * Renders an email html output
     * @param context
     * @returns {*}
     */
    renderHtml(context){
        return this.htmlJadeFunction(context);
    }

    /**
     * renders an email text output
     * @param context
     * @returns {*}
     */
    renderText(context){
        return this.textJadeFunction(context);
    }

    get text () {
        return this.renderText(this);
    }

    get html () {
        return this.renderHtml(this);
    }
}
