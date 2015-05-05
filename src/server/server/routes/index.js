var express = require('express'),
    router = express.Router(),
    listing = require('../controller/listing'),
    toplisting = require('../controller/toplisting');

// Listing Routes
router.get('/listing/{id:int}', listing.get);
router.get('/listing/list', listing.list);

// Toplisting Routes
router.get('/toplisting/list', toplisting.list);

module.exports = router;
