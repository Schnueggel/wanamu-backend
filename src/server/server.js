'use strict';

/**
 * Created by Christian on 4/27/2015.
 */
var express = require('express'),
    path = require('path'),
    config = require('./server/config'),
    livereload = require('connect-livereload'),
    logger = require('morgan'),
    app = express();

// Routing Setup
var router = require('./server/routes');

app.use(logger(process.env.NODE_ENV));
app.use(livereload());
app.use(express.static(path.resolve(__dirname + '/../app')));
app.use(router);

var server = app.listen(config.get('port'), function () {

    var host = server.address().address,
        port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
