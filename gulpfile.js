'use strict';

var gulp = require('gulp'),
    server = require('gulp-develop-server'),
    batch = require('gulp-batch'),
    gutil = require('gulp-util'),
    replace = require('gulp-replace'),
    runSequence = require('run-sequence'),
    webpack = require('webpack'),
    path = require('path'),
    del = require('del');

var tempPath = path.join(__dirname, '.tmp'),
    srcAppPath = path.join(__dirname, 'src/app'),
    srcServerPath = path.join(__dirname, 'src/server'),
    srcAppStaticFolder = path.join(srcAppPath, 'static'),
    srcIndexHtml = path.join(srcAppPath, 'index.html'),
    appscript = 'app.js',
    distPath = path.join(__dirname, 'dist'),
    distServerPath = path.join(distPath, 'server'),
    distServerScript = path.join(distServerPath, 'server.js'),
    distAppPath = path.join(distPath, 'app'),
    indexFileName = 'index.js',
    tmpAppPath = path.join(tempPath, 'app');

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

gulp.task('default', ['build', 'watch']);

gulp.task('build', function (cb) {
    runSequence('build-clean',
        'build-webpack',
        'build-app-html',
        ['dist-server', 'dist-app-static'], cb);
});
gulp.task('build-serve',  function () {
    runSequence('build', 'server:start');
});

/**
 * Dependend Tasks come here
 **/

gulp.task('build-clean', function () {
    return del([tempPath, distPath]);
});

gulp.task('server:start', function (cb) {
    server.kill('SIGTERM', function () {
        server.listen({path: distServerScript});
        cb();
    });
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

gulp.task('server:kill', function (cb) {
    server.kill('SIGTERM', function () {
        cb();
    });
});

gulp.task('watch', function () {
    gulp.watch('src/**/*.js', batch(function () {
        gulp.start('build');
    }));
});

gulp.task('build-app-html', function () {
    var script = '<script src="' + indexFileName + '"></script>';
    return gulp.src(srcIndexHtml)
        .pipe(replace('<!--scripts-->', script))
        .pipe(gulp.dest(distAppPath));
});

gulp.task('dist-server', function () {
    return gulp.src(path.join(srcServerPath, '**')).pipe(gulp.dest(distServerPath));
});
gulp.task('dist-app-static', function () {
    return gulp.src(path.join(path.join(srcAppStaticFolder, '**'))).pipe(gulp.dest(distAppPath));
});
