'use strict';

var toplistingModel = require('./../model/toplisting');

var toplisting = {
    list : function (request, response) {
        // ==============================================================================
        // Default result Object
        // ==============================================================================
        var result = {
            offset: request.param('offset', 0),
            limit: request.param('limit', 1000),
            total: 0,
            data: []
        };
        toplistingModel.findAndCountAll({
            limit: result.limit,
            offset: result.offset
        }, {
            raw: true
        }).then(function (res) {
            result.data = res.rows;
            result.total = res.count;
            result.count = res.count;
            response.send(result);
        }).catch(function (err) {
            response.sendStatus(500);
            console.log(err);
        });
    }
};
module.exports = toplisting;
