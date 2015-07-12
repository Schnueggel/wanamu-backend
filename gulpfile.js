'use strict';
/**
 * The main flow of the build proccess is to move file from src folder to
 * dist folder.
 * The dist folder contains the finished app
 */
// ==========================================================================
// Start node with harmony flag
// ==========================================================================
require('harmonize')();
/**
 * ######################################################################################
 * ######################################################################################
 * REQUIRE
 * ######################################################################################
 * ######################################################################################
 */
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    replace = require('gulp-replace'),
    merge = require('merge2'),
    runSequence = require('run-sequence'),
    path = require('path'),
    server = require('gulp-develop-server'),
    mocha = require('gulp-mocha'),
    fs = require('fs'),
    rename = require('gulp-rename'),
    del = require('del');
/**
 * ######################################################################################
 * ######################################################################################
 * PATH VARS
 * ######################################################################################
 * ######################################################################################
 */
var srcServerPath = path.join(__dirname, 'src/server'),
    distPath = path.join(__dirname, 'dist'),
    distServerPath = path.join(distPath, 'server'),
    distServerScript = path.join(distServerPath, 'server.js');

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
    runSequence('jshint', 'build-server', cb);
});

// ===========================================================================
// Build the server
// ===========================================================================
gulp.task('build-server', function (cb) {
    runSequence('build-clean-server', 'dist-server', cb);
});

// ====================================================================
// Builds the backend,
// starting the development.json server and opens a browser.
// ====================================================================
gulp.task('build-serve',  function (cb) {
    runSequence('build', 'build-development-database', 'server-start', 'watch', cb);
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
gulp.task('build-clean', ['build-clean-server'], function (cb) {
    cb();
});

// ==========================================================
// Remove all server code in dist folder
// ==========================================================
gulp.task('build-clean-server', function (cb) {
    return del([distServerPath], {}, cb);
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
        server.listen({
            path: distServerScript,
            env: {
                NODE_ENV : 'development',
                DEBUG:'monk:*'
            },
            execArgv: ['--harmony_generators']});
        cb();
    });
});

// ==================================================================
// Start all watch tasks
// ==================================================================
gulp.task('watch', ['watch-server'], function (cb) {
    cb();
});
// ==================================================================
// Restart the node server
// ==================================================================
gulp.task('server-restart', function (cb) {
    server.changed(function (error) {
        cb();
    });
});
/**
 * ######################################################################################
 * ######################################################################################
 * Watching Frontend and Backend and restart server  frontend
 * ######################################################################################
 * ######################################################################################
 */

// ==================================================================
// Watch the server code and restart the server on changes
// ==================================================================
gulp.task('watch-server', function () {
    gulp.watch(['src/server/**/*.*(js|json|ts)'], {debounceDelay: 2000}, function () {
        runSequence('build-server', 'server-restart');
    });
});

/**
 * ######################################################################################
 * ######################################################################################
 * MOVE FILES
 * ######################################################################################
 * ######################################################################################
 */

// ==========================================================================
// Moves the server code into the dist folder
// ==========================================================================
gulp.task('dist-server', function () {
    return gulp.src(srcServerPath + '/**/!(*.es6)').pipe(gulp.dest(distServerPath));
});

// ==========================================================================
// Move the app static files into the app folder
// ==========================================================================
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


// ==========================================================================
// Start server side unit tests with mocha
// ==========================================================================
gulp.task('test-mocha', ['prepare-mocha-tests'], function () {
    process.env.NODE_ENV = 'test';
    return gulp.src('test/mocha/**/**.js')
        .pipe(mocha({
            timeout: 5000
        }));
});

// ==========================================================================
// Setup everything for testing
// ==========================================================================
gulp.task('prepare-mocha-tests', function(cb){
    process.env.NODE_ENV = 'test';
    runSequence('build-test-database', 'build-server', cb);
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
    var modelpath = path.join(distServerPath, 'server', 'model'),
        sequelize = require(path.join(distServerPath, 'server', 'config', 'sequelize'));

    requireFolder(modelpath);

    process.env.NODE_ENV = 'development';
    sequelize.query('').then(function(){
        sequelize.sync({'force': false})
            .then(function(){
                var devDbSetupScript = path.join(distServerPath, 'server', 'setup', 'development', 'database.js');
                require(devDbSetupScript).then(function(){
                    cb();
                })
                .catch(function(err) {
                    throw err;
                });
            });
    });
});
// ==========================================================================
// Builds the test database
// ==========================================================================
gulp.task('build-test-database',['build-server'], function (cb) {
    process.env.NODE_ENV = 'test';
    var modelpath = path.join(distServerPath, 'server', 'model'),
        sequelize = require(path.join(distServerPath, 'server', 'config', 'sequelize'));

    requireFolder(modelpath);

    process.env.NODE_ENV = 'test';
    sequelize.query('').then(function(){
        sequelize.sync({'force': false}).then(function(){
            var testDbSetupScript = path.join(distServerPath, 'server', 'setup', 'test', 'database.js');
            require(testDbSetupScript).then(function(){
                cb();
            }).catch(function(err) {
                console.error(err);
                cb();
            });
        });
    });
});
// ==========================================================================
// Builds the production database
// ==========================================================================
gulp.task('build-production-database',['build-server'], function (cb) {
    require(path.join(srcServerPath, 'server', 'setup', 'production', 'database.js'))(cb);
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
        //Don't require .ts files
        if (stat.isFile() && path.extname(file) === '.js') {
            require(filepath);
        }
        if (stat.isDirectory()) {
            requireFolder(filepath);
        }
    });
};
