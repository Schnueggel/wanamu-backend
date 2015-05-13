var express = require('express'),
    router = express.Router(),
    TopListingController = require('../controller/toplisting'),
    ListingController = require('../controller/listing.js'),
    passport = require('../config/passport.js');



// ==========================================================================
// We have to wrap the controller action methods else they loose scope
// https://github.com/Microsoft/TypeScript/wiki/%27this%27-in-TypeScript#functionbind
// ==========================================================================
// Listing Routes

router.route('/listing')
    .get(ListingController.list)
    .post(ListingController.create);

router.route('/listing/:id')
    .put(ListingController.update)
    .get(ListingController.get)
    .delete(ListingController.destroy);


// Toplisting Routes
router.get('/toplisting/list', TopListingController.list);

/**
 * ######################################################################################
 * ######################################################################################
 * Authentication and Login
 * ######################################################################################
 * ######################################################################################
 */
router.route('/login').post(function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.session.messages =  [info.message];
            return res.status(401).send({message:'User could not be authenticated'});
        }

        req.logIn(user, function(err) {
            if (err) {
                return next(err);
            }
            return res.status(200).send({message: 'Login success!'});
        });
    })
});

router.route('/logout').get(function(req, res){
    req.logout();
    res.send({message: 'Logout successful!'});
});

module.exports = router;
