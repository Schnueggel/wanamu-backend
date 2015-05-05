'use strict';

var listingModel = require('./../model/listing');

var listing = {
    'get' : function (request, response) {
        // ==========================================================================
        // Default result object
        // ==========================================================================
        var result = {
            data: []
        };
        // ==========================================================================
        // Find a specific listing.
        // But not if it is flagged as deleted (deleted date is set)
        // ==========================================================================
        listingModel.find({
            where: {
                id: request.params.id,
                $and : {
                    deleted: null
                }
            }
        }).then(function (res) {
            if (res === null) {
                response.sendStatus(404);
                return;
            }
            result.data.push(res.toJSON());
            response.send(result);
        }).catch(function (err) {
            response.sendStatus(500);
            console.log(err);
        });
    },
    'list' : function (request, response) {
        console.log(request.params);
        var result = {
            limit: request.param('limit', 1000),
            offset: request.param('offset', 0),
            data: [],
            total: 0
        };
        console.log(result);
        listingModel.findAndCountAll({
            limit: result.limit,
            offset: result.offset
        }, {
            raw: true
        }).then(function (res) {
            result.data = res.rows;
            result.total = res.total;
            response.send(result);
        }).catch(function (err) {
            response.send(err);
            console.error(err);
        });
    }
};

module.exports = listing;
