'use strict';
class Listing {
    listingModel: Model;
    constructor (listingModel: Model) {
        this.listingModel = listingModel;
    }
    get(request, response) {
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
        this.listingModel.find({
            where: {
                id: request.params.id,
                $and: {
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
    }

    list(request, response) {
        console.log(request.params);
        var result = {
            limit: request.param('limit', 1000),
            offset: request.param('offset', 0),
            data: [],
            total: 0
        };
        this.listingModel.findAndCountAll({
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
}
export = Listing;
