var gulp = require('gulp'),
    server = require('gulp-develop-server'),
    watch = require('gulp-watch'),
    batch = require('gulp-batch');

gulp.task('default', ['build', 'watch'], function () {
    // place code for your default task here
});

gulp.task('build', ['server:start', 'watch'], function () {

});

gulp.task('server:start', ['move'], function (cb) {
    server.kill('SIGTERM', function () {
        server.listen({path: './dist/server.js'});
        cb(undefined);
    });
});

gulp.task('watch', function() {
    watch('src/**/*.js', batch(function () {
        gulp.start('build');
    }));
});

gulp.task('move', function (cb) {
    gulp.src('src/**').pipe(gulp.dest('dist'));
    cb(undefined);
});