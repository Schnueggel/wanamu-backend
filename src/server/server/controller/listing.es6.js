
var User = require('../model/user.js'),
    Category = require('../model/category.js'),
    ListingModel = require('../model/listing.js'),
    co = require('co');

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
    create: co.wrap(createListing),

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
};


function* createListing(req, res){
    let input = req.body || {},
        user = req.session.user,
        listing = null;

    if (!user.id) {
        res.status(401).send('No valid user informations could be found');
        return;
    }

    try{
        user =  yield User.find(user.id);
    }catch(err){
        console.error(err);
        res.status(401).send('No valid user could be found');
        return;
    }

    try{
        input.userId = user.get('id');
        listing = ListingModel.build(input,{
            isNewRecord: true
        });
        listing.set('userId',user.get('id'));
        yield listing.save();
    } catch(err){
        console.error(err);
        res.status(422).send(err);
        return;
    }

    yield listing.reload({
        include: [
            { model: Category, nested: true }
        ]
    });

    var data = listing.get({
        plain: true
    });

    res.send(data);
}
