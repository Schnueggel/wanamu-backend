'use strict';
/**
 * Created by Christian on 5/9/2015.
 */

var Util = {
    CHART_TYPE: {
        Alpha: 1, Numeric: 2, AlphaNumeric: 3
    },
    /**
     * Generates a listingId
     * @param prefix
     * @returns {string}
     */
    generateListingId: function (prefix) {
        var id = '';
        // Create hexcode fo timestamp
        var timestamp = Date.now().toString(16);

        id = prefix + '-' + timestamp + Util.getRandomString(2);

        id = id.substr(0, id.length - 4) + '-' + id.substr(id.length - 4);

        return id;
    },

    /**
     * Pads a number with zeros. If the number length exceeds the padding, the number is returned as string
     * @param num the number to pad
     * @param numZeros zeros used to pad
     * @returns {string}
     */
    zeroPad: function (num, numZeros) {
        var n = Math.abs(num);
        var zeros = Math.max(0, numZeros - Math.floor(n).toString().length);
        var zeroString = Math.pow(10, zeros).toString().substr(1);
        if (num < 0) {
            zeroString = '-' + zeroString;
        }

        return zeroString + n;
    },
    /**
     *
     * @param {length}
     * @param [alphanumeric]
     * @returns {string}
     */
    getRandomString: function (length, alphanumeric) {
        alphanumeric = alphanumeric || Util.CHART_TYPE.Alpha;
        var stringlist = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            text = '';

        if (length < 1) {
            return text;
        }

        if (alphanumeric === Util.CHART_TYPE.Numeric) {
            stringlist = '1234567890';
        } else if (alphanumeric === Util.CHART_TYPE.AlphaNumeric) {
            stringlist += '1234567890';
        }

        for (var i = 0; i < length; i++) {
            text += stringlist.charAt(Math.floor(Math.random() * stringlist.length));
        }

        return text;
    }, /**
     *
     * Gets all attributes from a SequelizeModel and removes the ones that are specified in notthis
     * @param {Object} SequelizeModel
     * @param {Array} notthis
     */
    getAllFieldsButNot: function(SequelizeModel, notthis) {
        var keys = Object.keys(SequelizeModel.attributes);
        keys.filter(function(item){
            return notthis.indexOf(item) === -1
        });
    }
};

module.exports = Util;
