'use strict';

var User = require('../model/user.js'),
    Category = require('../model/category.js');

/**
 * Listing Controller
 */
class Listing {
    listingModel: SequelizeModel;

    /**
     * Create Listing
     * @param listingModel
     */
    constructor (listingModel: SequelizeModel) {
        this.listingModel = listingModel;
    }

    /**
     * Update a listing
     * @param request
     * @param response
     */
    update (request, response) {

    }

    /**
     * Create a listing
     * @param request
     * @param response
     */
    create (request, response) {

        var input = request.body || {};
        var user = request.session.user;

        input.user = user.id;

        this.listingModel
            .create(input, {
                isNewRecord: true,
                include: [
                    { model: Category, nested: true}
                ]
            })
            .then(function(listing){
                listing
                    .reload()
                    .then(function(result){
                        response.send(result.get({
                            plain: true
                        }));
                    });
            })
            .catch(function(err) {
                console.error(err);
                response.send(500);
            });
    }

    /**
     * Delete a listing
     * @param request
     * @param response
     */
    delete (request, response) {

    }

    /**
     * Get a listing
     * @param request
     * @param response
     */
    get (request, response) {

        if (request.params.id === undefined) {
            console.error('Get:Listing missing id');
            response.sendStatus(403);
            return;
        }
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
        }).catch((err) => {
            response.sendStatus(500);
            console.log(err);
        });
    }

    /**
     * Get multiple listings
     * @param request
     * @param response
     */
    list(request, response) {
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
        }).then((res) => {
            result.data = res.rows;
            result.total = res.total;
            response.send(result);
        }).catch((err) => {
            response.send(err);
            console.error(err);
        });
    }
}


export = Listing;
