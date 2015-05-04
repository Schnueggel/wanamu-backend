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

app.use(logger('dev'));
app.use(livereload());
app.use(express.static(path.resolve(__dirname + '/../app')));
app.use(router);

var port = config.port;

var server = app.listen(port, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
