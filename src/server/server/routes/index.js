var express = require('express'),
    router = express.Router(),
    TopListingController = require('../controller/toplisting'),
    ListingController = require('../controller/listing.es6');



// ==========================================================================
// We have to wrap the controller action methods else they loose scope
// https://github.com/Microsoft/TypeScript/wiki/%27this%27-in-TypeScript#functionbind
// ==========================================================================
// Listing Routes

router.route('/listing')
    .get(ListingController.list)
    .post(ListingController.create);

router.route('/listing/{id:int}')
    .put(ListingController.update)
    .get(ListingController.get)
    .delete(ListingController.destroy);

// Toplisting Routes
router.get('/toplisting/list', TopListingController.list);


module.exports = router;
