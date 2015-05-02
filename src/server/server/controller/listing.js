'use strict';

var listing = require('./../model/listing');

var listing = {
    'get' : function (request, response) {
        var promise = listing.getListing(request.params.id);
        promise.then(function (res) {
            if (!res) {
                response.sendStatus(404);
                return;
            }
            response.send(res);
        }).catch(function (err) {
            response.sendStatus(500);
            console.log(err);
        });
    },
    'list' : function (request, response) {
        var promise = listing.getListings(request.params.limit, request.params.offset);
        promise.then(function (res) {
            /*if(!res) {
             response.sendStatus(404);
             return;
             }*/
            response.send(res);
        }).catch(function (err) {
            //response.sendStatus(500);
            response.send(err);
        });
    }
};

module.exports = listing;
