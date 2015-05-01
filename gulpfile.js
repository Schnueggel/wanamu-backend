'use strict';

var gulp = require('gulp'),
    server = require('gulp-develop-server'),
    gutil = require('gulp-util'),
    open = require('gulp-open'),
    livereload = require('gulp-livereload'),
    replace = require('gulp-replace'),
    runSequence = require('run-sequence'),
    webpack = require('webpack'),
    path = require('path'),
    del = require('del');

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

var webpackConfig = {
    context: __dirname,
    entry: path.join(srcAppPath, appscript),
    output: {
        path: distAppPath,
        filename: indexFileName
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
 * Main Tasks come here
 **/
// Default task Builds the application. Just call gulp
gulp.task('default', ['build']);

gulp.task('build', function (cb) {
    runSequence('build-server', 'build-app', cb);
});
//Builds frontend and backend, starting the development server and opens a browser.
gulp.task('build-serve',  function (cb) {
    runSequence('build', 'server-start', 'watch', 'http-browser', cb);
});
//Builds the frontend
gulp.task('build-app', function (cb) {
    runSequence('build-clean-app',
        'build-webpack',
        'build-app-html',
        'dist-app-static', cb);
});

//Build the server
gulp.task('build-server', function (cb) {
    runSequence('build-clean-server',
        'dist-server', cb);
});

/**
 * Dependend Tasks come here
 **/
gulp.task('build-clean', ['build-clean-app', 'build-clean-server'], function (cb) {
    cb();
});
gulp.task('build-clean-app', function (cb) {
    return del([distAppPath], {}, cb);
});
gulp.task('build-clean-server', function (cb) {
    return del([distServerPath], {}, cb);
});

// Create webpacked files
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
 * Server start, restart, and browser open and Refresh
 */
gulp.task('server-start', function (cb) {
    server.kill('SIGTERM', function () {
        server.listen({path: distServerScript}, livereload.listen);
        cb();
    });
});

gulp.task('http-browser', function () {
    var options = {
        url: 'http://localhost:3000'
    };
    return gulp.src(distIndexHtml)
        .pipe(open('', options));
});

gulp.task('server-restart', function (cb) {
    server.changed(function (error) {
        if (!error) {
            gulp.run('livereload');
        }
        cb();
    });
});

/**
 * Watching Frontend and Backend and restart server or livereload frontend
 */

gulp.task('watch', ['watch-server', 'watch-app'], function (cb) {
    cb();
});

gulp.task('watch-server', function (cb) {
    gulp.watch(['src/server/**/*.js'], {debounceDelay: 2000}, function () {
        runSequence('build-server', 'server-restart');
    });
    cb();
});
gulp.task('watch-app', function (cb) {
    gulp.watch(['src/app/**/*.js', 'src/app/**/*.html'], {debounceDelay: 2000}, function () {
        runSequence('build-app', 'livereload');
    });
    cb();
});
gulp.task('livereload', function (cb) {
    livereload.changed(distIndexHtml);
    cb();
});

/**
 * Build and file moving
 */
// Build the index.html of the frontend and move it to the app folder
gulp.task('build-app-html', function () {
    var script = '<script src="' + indexFileName + '"></script>';
    return gulp.src(srcIndexHtml)
        .pipe(replace('<!--scripts-->', script))
        .pipe(gulp.dest(distAppPath));
});
//Moves the server code into the dist folder
gulp.task('dist-server', function () {
    return gulp.src(path.join(srcServerPath, '**')).pipe(gulp.dest(distServerPath));
});
//Move the app static files into the app folder
gulp.task('dist-app-static', function () {
    return gulp.src(path.join(srcAppStaticFolder, '**')).pipe(gulp.dest(distAppPath));
});
