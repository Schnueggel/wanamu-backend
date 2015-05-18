'use strict';

/**
 * Created by Christian on 4/27/2015.
 */
var config = require('./server/config'),
    logger = require('koa-logger'),
    cors = require('koa-cors'),
    bodyParser = require('koa-bodyparser'),
    session = require('koa-session'),
    passport = require('koa-passport'),
    app = require('koa')();


if (!config.isTest()) {
    app.use(logger());
}

app.keys = [config.get('session').secret];

app.use(cors({
    maxAge: config.get('cacheTime') / 1000,
    credentials: true,
    methods: 'GET, HEAD, OPTIONS, PUT, POST, DELETE',
    headers: 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
}));

app.use(bodyParser());

app.use(session({}, app));
app.use(passport.initialize());
app.use(passport.session());

require('./server/routes')(app);

// create http and websocket servers and start listening for requests
app.listen(config.get('port'));
