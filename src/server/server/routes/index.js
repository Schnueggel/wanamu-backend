var express = require('express'),
    router = express.Router(),
    listing = require('../controller/listing'),
    toplisting = require('../controller/toplisting.js');

// Listing Routes
router.get('/listing/:id', listing.get);
router.get('/listing/list/:limit/:offset', listing.list);

// Toplisting Routes
router.get('/toplisting/list', toplisting.list);

module.exports = router;
