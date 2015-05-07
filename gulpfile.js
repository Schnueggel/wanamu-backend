'use strict';

/**
 * ######################################################################################
 * ######################################################################################
 * REQUIRE
 * ######################################################################################
 * ######################################################################################
 */
var gulp = require('gulp'),
    server = require('gulp-develop-server'),
    gutil = require('gulp-util'),
    open = require('gulp-open'),
    livereload = require('gulp-livereload'),
    jshint = require('gulp-jshint'),
    replace = require('gulp-replace'),
    runSequence = require('run-sequence'),
    webpack = require('webpack'),
    path = require('path'),
    karma = require('karma').server,
    mocha = require('gulp-mocha'),
    fs = require('fs'),
    del = require('del');
/**
 * ######################################################################################
 * ######################################################################################
 * PATH VARS
 * ######################################################################################
 * ######################################################################################
 */
var srcAppPath = path.join(__dirname, 'src/app'),
    srcServerPath = path.join(__dirname, 'src/server'),
    srcAppStaticFolder = path.join(srcAppPath, 'static'),
    srcIndexHtml = path.join(srcAppPath, 'index.html'),
    appscript = 'app.js',
    distPath = path.join(__dirname, 'dist'),
    distServerPath = path.join(distPath, 'server'),
    distServerScript = path.join(distServerPath, 'server.js'),
    distAppPath = path.join(distPath, 'app'),
    distIndexHtml = path.join(distAppPath, 'index.html'),
    indexFileName = 'index.js';

/**
 * ######################################################################################
 * ######################################################################################
 * VAR DEFINITION
 * ######################################################################################
 * ######################################################################################
 */
var requireFolder = null;
/**
 * ######################################################################################
 * ######################################################################################
 * WEBPACK CONFIG
 * ######################################################################################
 * ######################################################################################
 */
var webpackConfig = {
    context: __dirname,
    entry: path.join(srcAppPath, appscript),
    output: {
        path: distAppPath,
        filename: indexFileName.replace('.js','-' + Date.now() + '.js')
    },
    module: {
        noParse: [
            /[\/\\]angular\.js$/,
            /[\/\\]angular-ui-router\.js$/,
            /[\/\\]angular-translate\.js$/
        ],
        loaders : [
            {
                test: /\.es6\.js$/,
                loader: 'babel'
            },
            {
                test: /\.ts$/,
                loader: ['babel', 'typescript']
            },
            {
                test: /\.html$/,
                loader: 'raw'
            }
        ]
    }
};
/**
 * ######################################################################################
 * ######################################################################################
 * Main Tasks come here
 * ######################################################################################
 * ######################################################################################
 */
// ===================================================================
// Default task Builds the application. Just call gulp
// ===================================================================
gulp.task('default', ['build']);
// ===================================================================
// Build the application into the dist folder
// ===================================================================
gulp.task('build', function (cb) {
    runSequence('jshint', 'build-server', 'build-app', cb);
});
// ====================================================================
// Builds frontend and backend,
// starting the development.json server and opens a browser.
// ====================================================================
gulp.task('build-serve',  function (cb) {
    runSequence('build', 'server-start', 'watch', 'http-browser', cb);
});
// ======================================================
// Test frontend and backend
// ======================================================
gulp.task('test', function (cb) {
    runSequence('test-jasmine', 'test-mocha', cb);
});
// ===========================================================================
// Builds the frontend
// ===========================================================================
gulp.task('build-app', function (cb) {
    runSequence('build-clean-app',
        'build-webpack',
        'build-app-html',
        'dist-app-static', cb);
});
// ===========================================================================
// Build the server
// ===========================================================================
gulp.task('build-server', function (cb) {
    runSequence('build-clean-server',
        'dist-server', cb);
});

/**
 * ######################################################################################
 * ######################################################################################
 * Dependend Tasks come here
 * ######################################################################################
 * ######################################################################################
 */
// =========================================================
// Start all clean tasks
// =========================================================
gulp.task('build-clean', ['build-clean-app', 'build-clean-server'], function (cb) {
    cb();
});
// ==========================================================
// Remove all app code in dist folder
// ==========================================================
gulp.task('build-clean-app', function (cb) {
    return del([distAppPath], {}, cb);
});
// ==========================================================
// Remove all server code in dist folder
// ==========================================================
gulp.task('build-clean-server', function (cb) {
    return del([distServerPath], {}, cb);
});
// ===========================================================
// Create webpacked files
// ===========================================================
gulp.task('build-webpack', function (callback) {
    var webpackCompiler = webpack(webpackConfig);
    webpackCompiler.run(function (err, stats) {
        if (err) {
            throw new gutil.PluginError('build-webpack', err);
        }
        gutil.log('[build-webpack]', stats.toString({
            colors: true
        }));
        callback();
    });
});
/**
 * ######################################################################################
 * ######################################################################################
 * Server start, restart, and browser open and Refresh
 * ######################################################################################
 * ######################################################################################
 */
// ============================================================
// Start a development.json server using the real server script
// ============================================================
gulp.task('server-start', function (cb) {
    server.kill('SIGTERM', function () {
        server.listen({path: distServerScript}, livereload.listen);
        cb();
    });
});
// =================================================================
// Open the browser and opens the frontend of this app
// =================================================================
gulp.task('http-browser', function () {
    var options = {
        url: 'http://localhost:3000'
    };
    return gulp.src(distIndexHtml)
        .pipe(open('', options));
});
// ==================================================================
// Restart the node server and then livereload
// ==================================================================
gulp.task('server-restart', function (cb) {
    server.changed(function (error) {
        if (!error) {
            gulp.run('livereload');
        }
        cb();
    });
});
/**
 * ######################################################################################
 * ######################################################################################
 * Watching Frontend and Backend and restart server or livereload frontend
 * ######################################################################################
 * ######################################################################################
 */
// ==================================================================
// Start all watch tasks
// ==================================================================
gulp.task('watch', ['watch-server', 'watch-app'], function (cb) {
    cb();
});
// ==================================================================
// Watch the server code and restart the server on changes
// ==================================================================
gulp.task('watch-server', function () {
    gulp.watch(['src/server/**/*.js', 'src/server/**/*.json'], {debounceDelay: 2000}, function () {
        runSequence('build-server', 'server-restart');
    });
});
// ===================================================================
// Watch frontend code and reload the webpage if changes occur
// ===================================================================
gulp.task('watch-app', function () {
    gulp.watch(['src/app/**/*.js', 'src/app/**/*.html'], {debounceDelay: 2000}, function () {
        runSequence('build-app', 'livereload');
    });
});
// ===================================================================
// Reload the browser page
// ===================================================================
gulp.task('livereload', function (cb) {
    livereload.changed(distIndexHtml);
    cb();
});

// =========================================================================
// Build the index.html of the frontend and move it to the app folder
// =========================================================================
gulp.task('build-app-html', function () {
    var script = '<script src="' + webpackConfig.output.filename + '"></script>';
    return gulp.src(srcIndexHtml)
        .pipe(replace('<!--scripts-->', script))
        .pipe(gulp.dest(distAppPath));
});
// ===============================================================
// Moves the server code into the dist folder
// ===============================================================
gulp.task('dist-server', function () {
    return gulp.src(path.join(srcServerPath, '**')).pipe(gulp.dest(distServerPath));
});
// ===================================================================================
// Move the app static files into the app folder
// ===================================================================================
gulp.task('dist-app-static', function () {
    return gulp.src(path.join(srcAppStaticFolder, '**')).pipe(gulp.dest(distAppPath));
});

/**
 * ######################################################################################
 * ######################################################################################
 * TEST TASKS
 * ######################################################################################
 * ######################################################################################
 */
// ================================================================
// Start frontend unit tests
// ================================================================
gulp.task('test-jasmine', ['build-webpack'], function (cb) {
    process.env.NODE_ENV = 'test';
    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, cb);
});

// =================================================================
// Start server side unit tests with mocha
// =================================================================
gulp.task('test-mocha', ['build-test-database'], function () {
    process.env.NODE_ENV = 'test';
    return gulp.src('test/mocha/**/**.js')
        .pipe(mocha());
});

/**
 * ######################################################################################
 * ######################################################################################
 * DATABASE DEPLOYMENT
 * ######################################################################################
 * ######################################################################################
 */
// ==========================================================================
// Builds the development database
// ==========================================================================
gulp.task('build-development-database', function (cb) {
    process.env.NODE_ENV = 'development';
    var modelpath = path.join(srcServerPath, 'server', 'model'),
        sequelize = require(path.join(srcServerPath, 'server', 'config', 'index.js')).getSequelize();

    requireFolder(modelpath);

    process.env.NODE_ENV = 'development';
    sequelize.sync({'force': true})
        .then(function(){
            cb();
        })
        .catch(function(err) {
            throw err;
    });
});
// ==========================================================================
// Builds the test database
// ==========================================================================
gulp.task('build-test-database', function (cb) {
    process.env.NODE_ENV = 'test';
    var modelpath = path.join(srcServerPath, 'server', 'model'),
        sequelize = require(path.join(srcServerPath, 'server', 'config', 'index.js')).getSequelize();

    requireFolder(modelpath);

    process.env.NODE_ENV = 'test';
    sequelize.sync({'force': true}).then(function(){
        require(path.join(srcServerPath,'server','setup', 'test', 'database.js')).then(function(){
            console.log('GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGhui');
            cb();
        }).catch(function(err) {
            console.error(err);
            cb();
        });
    });

    // TODO INSERT DATA
});
// ==========================================================================
// Builds the production database
// ==========================================================================
gulp.task('build-production-database', function (cb) {
    var modelpath = path.join(srcServerPath, 'server', 'model'),
        sequelize = require(path.join(srcServerPath, 'server', 'config', 'index.js')).getSequelize();

    requireFolder(modelpath);

    process.env.NODE_ENV = 'production';
    sequelize.sync().then(function(){cb();});
    //TODO INSERT DATA
});

// ==========================================================================
// Code Quality
// ==========================================================================
gulp.task('jshint', function () {
    var json = JSON.parse(require('fs').readFileSync(('./.jshintrc')));
    return gulp.src('src')
        .pipe(jshint(json));
});

/**
 * ######################################################################################
 * ######################################################################################
 * HELPER FUNCTIONS
 * ######################################################################################
 * ######################################################################################
 */

/**
 * Requires all js files in a folder
 * @param {string} folder path to folder
 */
requireFolder = function (folder) {
    var stat = null,
        filepath = null;
    fs.readdirSync(folder).forEach(function (file) {
        filepath = path.join(folder, file);
        stat = fs.statSync(filepath);
        if (stat.isFile()) {
            require(filepath);
        }
        if (stat.isDirectory()) {
            requireFolder(filepath);
        }
    });
};
