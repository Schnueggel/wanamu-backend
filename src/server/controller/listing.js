var express = require('express');
var router = express.Router();

var listing = require('./../model/listing');

router.get('/:id', function(request, response) {
    var promise = listing.getListing(request.params.id);
    promise.then(function(res) {
        if(!res) {
            response.sendStatus(404);
            return;
        }
        response.send(res);
    }).catch(function(err) {
        response.sendStatus(500);
        //response.send(err);
    })
});

router.get('/list/:limit/:offset', function(request, response) {
    var promise = listing.getListings(request.params.limit, request.params.offset);
    promise.then(function(res) {
        /*if(!res) {
            response.sendStatus(404);
            return;
        }*/
        response.send(res);
    }).catch(function(err) {
        //response.sendStatus(500);
        response.send(err);
    })
});

module.exports = router;