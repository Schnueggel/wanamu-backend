var express = require('express'),
    router = express.Router(),
    listingModel = require('../model/listing'),
    topListingModel = require('../model/toplisting');

import Toplisting = require('../controller/Toplisting');
import Listing = require('../controller/Listing');

var ListingController = new Listing(listingModel);
var TopListingController = new Toplisting(topListingModel);

// Listing Routes
router.get('/listing/{id:int}', ListingController.get);
router.get('/listing/list', ListingController.list);

// Toplisting Routes
router.get('/toplisting/list', TopListingController.list);

export = router;
