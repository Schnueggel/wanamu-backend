'use strict';
/**
 * Created by Christian on 5/9/2015.
 */
var listingModel = require('../model/listing');

module Util {
    export enum CHART_TYPE{
       Alpha =  1, Numeric = 2, AlphaNumeric = 3
    }
    /**
     * This Class is used for singleton and should not be used directly.
     * Instead use Util.Instance
     */
    export class __UtilClass {

        constructor() {
            if(Util.Instance){
                throw new Error("Error: Instantiation failed: Use Util.Instance instead of new.");
            }
            Util.Instance = this;
        }

        /**
         * Generates a listingId
         * @param prefix
         * @returns {string}
         */
        public generateListingId (prefix : string): string {
            var id = '';
            // Create hexcode fo timestamp
            var timestamp = Date.now().toString(16);

            id = prefix + '-' + timestamp + this.getRandomString(2);

            id = id.substr(0, id.length - 4) + '-' + id.substr(id.length - 4);

            return id;
        }

        /**
         *
         * @param length
         * @param alphanumeric
         * @returns {string}
         */
        public getRandomString (length : number, alphanumeric : CHART_TYPE = CHART_TYPE.Alpha): string {
            var stringlist = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
                text = '';

            if (length < 1) {
                return text;
            }

            if (alphanumeric === CHART_TYPE.Numeric) {
                stringlist = '1234567890';
            } else if (alphanumeric === CHART_TYPE.AlphaNumeric) {
                stringlist += '1234567890';
            }

            for( var i=0; i < length; i++ ) {
                text += stringlist.charAt(Math.floor(Math.random() * stringlist.length));
            }

            return text;
        }
    }
    export var  Instance:__UtilClass = new __UtilClass();
}

export = Util;
