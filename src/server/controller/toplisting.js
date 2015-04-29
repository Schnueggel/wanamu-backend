var express = require('express');
var router = express.Router();

var toplisting = require('./../model/toplisting');

router.get('/', function(request, response) {
    var promise = toplisting.getAll();
    promise.then(function(res) {
        /*if(!res) {
            response.sendStatus(404);
            return;
        }*/
        response.send(res);
    }).catch(function(err) {
        response.sendStatus(500);
        //response.send(err);
    })
});

module.exports = router;
