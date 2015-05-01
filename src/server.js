/**
 * Created by Christian on 4/27/2015.
 */
var express = require('express');
var path = require('path');
var config = require('./server/config');
var app = express();

// Routing Setup
var router = require('./server/controller');

app.use(router);
app.use(express.static(path.join(__dirname, 'public')));

var port = config.port;

var server = app.listen(port, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
