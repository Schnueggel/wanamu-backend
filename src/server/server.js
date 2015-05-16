'use strict';

/**
 * Created by Christian on 4/27/2015.
 */
var mongo = require('./server/config/mongo.js'),
    config = require('./server/config'),
    co = require('co'),
    logger = require('koa-logger'),
    cors = require('koa-cors'),
    bodyParser = require('koa-bodyparser'),
    app = require('koa')();


if (!config.isTest()) {
    app.use(logger());
}

app.use(cors({
    maxAge: config.get('cacheTime') / 1000,
    credentials: true,
    methods: 'GET, HEAD, OPTIONS, PUT, POST, DELETE',
    headers: 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
}));

app.use(bodyParser());

require('./server/routes')(app);

// create http and websocket servers and start listening for requests
app.listen(config.get('port'));
