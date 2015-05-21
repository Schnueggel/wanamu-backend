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
    co = require('co'),
    app = require('koa')();

app.init = co.wrap(function *() {
    if (config.isTest()) {
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


    console.log('TodoIt backend listening on port ' + config.get('port'));
    // ==========================================================================
    // We store the http server object. Koa uses nodes http.Server
    // This is useful to close connection for tests
    // ==========================================================================
    app.server = app.listen(config.get('port'));
});

module.exports = app;

// ==========================================================================
// We start the app automatically if its not required by another module
// This is useful for testing (supertest)
// ==========================================================================
if (!module.parent) {
    app.init().catch(function (err) {
        console.error(err.stack);
        process.exit(1);
    });
}
