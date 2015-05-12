
var User = require('../model/user.js'),
    Category = require('../model/category.js'),
    ListingModel = require('../model/listing.js');

module.exports = {

    /**
     * Update a listing
     * @param request
     * @param response
     */
    update: function (request, response) {

    },

    /**
     * Create a listing
     * @param request
     * @param response
     */
    create: function (request, response) {

        let input = request.body || {},
            user = request.session.user;

        input.user = user.id;

        ListingModel
            .create(input, {
                isNewRecord: true
            })
            .then(function(listing){
                listing
                    .reload({
                        include: [
                            { model: Category, nested: true }
                        ]
                    })
                    .then(function(result){
                        response.send(result.get({
                            plain: true
                        }));
                    });
            })
            .catch(function(err) {
                console.error(err);
                response.status(422).send(err);
            });
    },

    /**
     * Delete a listing
     * @param request
     * @param response
     */
    delete: function (request, response) {

    },

    /**
     * Get a listing
     * @param request
     * @param response
     */
    get: function (request, response) {

        if (request.params.id === undefined) {
            console.error('Get:Listing missing id');
            response.sendStatus(403);
            return;
        }
        // ==========================================================================
        // Default result object
        // ==========================================================================
        let result = {
            data: []
        };
        // ==========================================================================
        // Find a specific listing.
        // But not if it is flagged as deleted (deleted date is set)
        // ==========================================================================
        ListingModel.find({
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
    },

    /**
     * Get multiple listings
     * @param request
     * @param response
     */
    list: function(request, response) {
        let result = {
            limit: request.param('limit', 1000),
            offset: request.param('offset', 0),
            data: [],
            total: 0
        };
        ListingModel.findAndCountAll({
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
