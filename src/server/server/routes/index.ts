var express = require('express'),
    router = express.Router(),
    listingModel = require('../model/listing'),
    topListingModel = require('../model/toplisting');

import Toplisting = require('../controller/Toplisting');
import Listing = require('../controller/Listing');

var ListingController = new Listing(listingModel);
var TopListingController = new Toplisting(topListingModel);

// ==========================================================================
// We have to wrap the controller action methods else they loose scope
// https://github.com/Microsoft/TypeScript/wiki/%27this%27-in-TypeScript#functionbind
// ==========================================================================
// Listing Routes

router.route('/listing')
    .get((rq, rs) => ListingController.list(rq, rs))
    .post((rq, rs) => ListingController.create(rq, rs));

router.route('/listing/{id:int}')
    .put((rq, rs) => ListingController.update(rq, rs))
    .get((rq, rs) => ListingController.get(rq, rs))
    .delete((rq, rs) => ListingController.delete(rq, rs));

// Toplisting Routes
router.get('/toplisting/list', (rq, rs) => TopListingController.list(rq, rs));


export = router;
