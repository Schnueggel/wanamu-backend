'use strict';

/**
 * Created by Christian on 4/27/2015.
 */
var express = require('express'),
    path = require('path'),
    config = require('./server/config'),
    livereload = require('connect-livereload'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    app = express();


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Routing Setup
var router = require('./server/routes');


app.use(logger('combined'));
app.use(livereload());
app.use(express.static(path.resolve(__dirname + '/../app')));
app.use(function(req, res, next) {
    req.session = {
        user: {
            id : 1
        }
    };
    next();
});

app.use(router);

var server = app.listen(config.get('port'), function () {

    var host = server.address().address,
        port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
