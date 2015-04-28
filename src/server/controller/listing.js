var express = require('express');
var router = express.Router();

var listing = require('./../model/listing');

router.get('/:id', function(request, response) {
    var promise = listing.getListing(request.params.id);
    promise.then(function(res) {
        if(!res) {
            response.send(404);
            return;
        }
        response.send(res);
    }).catch(function(err) {
        response.send(500);
        //response.send(err);
    })
});

module.exports = router;