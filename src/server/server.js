'use strict';

let config = require('./server/config'),
    logger = require('koa-logger'),
    cors = require('koa-cors'),
    bodyParser = require('koa-bodyparser'),
    session = require('koa-generic-session'),
    passport = require('koa-passport'),
    auth = require('koa-basic-auth'),
    forcessl = require('koa-force-ssl'),
    http = require('http'),
    https = require('https'),
    fs = require('fs'),
    co = require('co'),
    app = require('koa')();

app.init = co.wrap(function *() {
    if (!config.isTest()) {
        app.use(logger());
    }
    if (config.isStaging() || config.isProduction()) {
        console.log('SLL enforced');
        app.use(forcessl());
    }

    app.keys = [config.get('session').secret];
    app.use(session());
    // =============================================================================================
    // We must allow Cross origin to seperate the frontends from the backend
    // =============================================================================================
    app.use(cors({
        maxAge: config.get('cacheTime') / 1000,
        credentials: true,
        methods: 'GET, HEAD, OPTIONS, PUT, POST, DELETE',
        headers: 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    }));

    // =============================================================================================
    // We use basic auth only when env is set
    // =============================================================================================
    if (config.get(config.statics.WU_HTTP_AUTH)){
        console.log('Protect application with http basic authentication');
        let credentials = {
            name: config.get(config.statics.WU_HTTP_USER),
            pass: config.get(config.statics.WU_HTTP_PASSWORD)
        };

        app.use(function *(next){
            try {
                yield next;
            } catch (err) {
                if (401 === err.status) {
                    this.status = 401;
                    this.set('WWW-Authenticate', 'Basic');
                    this.body = 'You must authenticate';
                } else {
                    throw err;
                }
            }
        });

        app.use(auth(credentials));
    }

    app.use(bodyParser());

    app.use(passport.initialize());
    app.use(passport.session());

    require('./server/routes')(app);
    let options = {
        pfx: fs.readFileSync(config.WU_BACKEND_PFX)
    };
    // ==========================================================================
    // We store the http server object. Koa uses nodes http.Server
    // This is useful to close connection for tests
    // ==========================================================================
    app.server = http.createServer(app.callback()).listen(config.PORT);
    if (!config.isTest()) {
        app.serverSSL = https.createServer(options, app.callback()).listen(config.PORTSSL);
        console.log(`Wanamu SSL backend listening on port ${config.PORTSSL}`);
    }

    console.log(`Wanamu backend listening on port ${config.PORT}`);

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
