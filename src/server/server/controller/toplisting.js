'use strict';

var toplistingModel = require('./../model/toplisting');

var toplisting = {
    list : function (request, response) {
        var promise = toplistingModel.getAll();
        promise.then(function (res) {
            /*if(!res) {
             response.sendStatus(404);
             return;
             }*/
            response.send(res);
        }).catch(function (err) {
            response.sendStatus(500);
            //response.send(err);
        });
    }
};
module.exports = toplisting;
