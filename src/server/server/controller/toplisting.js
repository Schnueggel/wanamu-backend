'use strict';

var topListingModel = require('../model/toplisting.js');

module.exports = {
    list: function(request, response) {
        // ==============================================================================
        // Default result Object
        // ==============================================================================
        var result = {
            offset: request.param('offset', 0),
            limit: request.param('limit', 1000),
            total: 0,
            data: []
        };
        topListingModel.findAndCountAll({
            limit: result.limit,
            offset: result.offset
        }, {
            raw: true
        }).then(function (res) {
            result.data = res.rows;
            result.total = res.count;
            response.send(result);
        }).catch(function (err) {
            response.sendStatus(500);
            console.log(err);
        });
    }
};
