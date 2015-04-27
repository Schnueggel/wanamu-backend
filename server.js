/**
 * Created by Christian on 4/27/2015.
 */
var express = require('express');

var app = express();
var test = 0;

app.use(function(req, res, next){
    console.log(test++);
    next();
});
app.get('/', function (req, res) {
    res.send('Hello World!');
});

var server = app.listen(3000, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});