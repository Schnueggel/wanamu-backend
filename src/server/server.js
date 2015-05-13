'use strict';

/**
 * Created by Christian on 4/27/2015.
 */
var express = require('express'),
    path = require('path'),
    config = require('./server/config'),
    livereload = require('connect-livereload'),
    logger = require('morgan'),
    passport = require('./server/config/passport.js'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    router = require('./server/routes'),
    app = express();


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(express.static(path.resolve(__dirname + '/../app')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use (session(config.get('session')));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.dev());

app.use(logger('combined'));
app.use(livereload());
app.use(router);

var server = app.listen(config.get('port'), function () {

    var host = server.address().address,
        port = server.address().port;

    console.log('Nautic-Online listening at http://%s:%s', host, port);
});
