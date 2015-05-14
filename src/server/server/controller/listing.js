'use strict';

var User = require('../model/user.js'),
    Category = require('../model/category.js'),
    ListingModel = require('../model/listing.js'),
    Util = require('../util/util.js'),
    co = require('co');

module.exports = {
    update: co.wrap(updateListing),
    create: co.wrap(createListing),
    destroy: co.wrap(destroyListing),
    get: co.wrap(getListing),
    list: co.wrap(listListing)
};


function* updateListing(req, res) {

    let user = req.user,
        input = req.body || {},
        listing = null;

    // ==========================================================================
    // Try to find the listing
    // ==========================================================================
    try {
        listing = yield ListingModel.findOne(req.params.id);
        if (!listing ) {
            throw new Error('No listing found with ID: ', req.params.id);
        }
    } catch (err) {
        console.error(err);
        res.status(404).send('Listing could not be found');
        return;
    }
    // ==========================================================================
    // Check Permissions
    // ==========================================================================
    if (user.UserGroup.name !== 'admin' && listing.get('userId') !== user.get('id')) {
        console.error('Listing does not belong to user');
        res.status(403).send('Listing does not belong to user');
        return;
    }

    // ==========================================================================
    // Update Listing
    // ==========================================================================
    try {
        yield listing.updateAttributes(input, {
            // Fields Allowed to updated
            fields: Util.getAllFieldsButNot(ListingModel,[
                'userId', 'id'
            ])
        });
    } catch (err) {
        console.error(err);
        res.status(422).send(err);
        return;
    }
    // ==========================================================================
    // Reload data from database
    // ==========================================================================
    yield listing.reload({
        include: [
            {model: Category, nested: true}
        ]
    });

    // ==========================================================================
    // Send to client
    // ==========================================================================
    var data = listing.get({
        plain: true
    });

    res.send({
        data: data
    });

}

/**
 * Destroys a listing
 * @param req
 * @param res
 */
function* destroyListing(req, res) {

    let user = req.user,
        listing = null;

    // ==========================================================================
    // Try to find Listing
    // ==========================================================================
    try {
        listing = yield Listing.find(req.params.id);
    } catch (err) {
        console.error(err);
        res.status(404).send('Listing could not be found');
        return;
    }
    // ==========================================================================
    // Check permissions
    // ==========================================================================
    if (user.UserGroup.name !== 'admin' && listing.get('userId') != user.get('id')) {
        console.error('Listing does not belong to user');
        res.status(401).send('Listing does not belong to user');
        return;
    }

    // ==========================================================================
    // Destroy listing
    // ==========================================================================
    try {
        yield listing.destroy();
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting the listing');
        return;
    }
    res.status(200).send({});

}

/**
 * Creates a listing
 * Expects request.body to be set
 * @param req
 * @param res
 */
function* createListing(req, res) {
    let input = req.body || {},
        user = req.user,
        listing = null;

    // ==========================================================================
    // Try to create a new listing
    // ==========================================================================
    try {
        input.userId = user.get('id');
        listing = ListingModel.build(input, {
            isNewRecord: true
        });
        listing.set('userId', user.get('id'));
        yield listing.save();
    } catch (err) {
        console.error(err);
        // TODO distinct between validation errors and other errors
        res.status(422).send(err);
        return;
    }

    // ==========================================================================
    // Reload data from database
    // ==========================================================================
    yield listing.reload({
        include: [
            {model: Category, nested: true}
        ]
    });

    // ==========================================================================
    // Send to client
    // ==========================================================================
    var data = listing.get({
        plain: true
    });

    res.send({
        data: data
    });
}

/**
 * Get a single Listing
 * Needs request.params.id field
 * @param req
 * @param res
 */
function* getListing(req, res) {
    // ==========================================================================
    // Default result object
    // ==========================================================================
    let result = {
            data: []
        },
        listing;
    // ==========================================================================
    // Find a specific listing.
    // But not if it is flagged as deleted (deleted date is set)
    // ==========================================================================

    try {
        listing = yield ListingModel.findOne({
            where: {
                id: req.params.id,
                $and: {
                    deletedAt: null
                }
            }
        });

        if (!listing){
            res.status(404).send('Listing not found');
            return;
        }
    } catch (err) {
        console.error(err);
        res.send(500);
        return;
    }

    result.data.push(listing.toJSON());
    res.send(result);
}
/**
 * Get a list of Listings
 * Accepts request params
 * {
 *  query {
 *      limit: [int],
 *      offset: [int]
*   }
 * }
 * @param req
 * @param res
 */
function* listListing(req, res) {
    let result = {
            limit: req.query.limit ? req.query.limit : 1000,
            offset: req.query.offset !== 0 ? req.query.offset : 0,
            data: [],
            total: 0
        },
        listings = null;

    // ==========================================================================
    // Try to find listings
    // ==========================================================================
    try {
        listings = yield ListingModel.findAndCountAll({
            limit: result.limit,
            offset: result.offset
        }, {
            raw: true
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }

    // ==========================================================================
    // Send data
    // ==========================================================================
    result.data = listings.rows;
    result.total = listings.total;
    res.send(result);
}

