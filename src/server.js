/**
 * Created by Christian on 4/27/2015.
 */
var express = require('express');
var path = require('path');
var mysql = require('mysql');

var app = express();

var router = require('./server/controller/index');
//var listing = require('./src/server/controller/listing');

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

app.use(router);
//app.use('/listing', listing);
app.use(express.static(path.join(__dirname, 'public')));



/*app.get('/', function (req, res) {
    res.send('Hello World!');
});*/

var server = app.listen(port, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});


/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}