/**
 * Created by Christian on 4/27/2015.
 */
var express = require('express');
var path = require('path');
var mysql = require('mysql');



var app = express();

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// Database

var pool  = mysql.createPool({
    host     : 'localhost',
    user     : 'nautic',
    password : 'nautic',
    database : 'nautic'
});
app.set('dbPool', pool);


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