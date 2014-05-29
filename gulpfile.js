var gulp   = require('gulp'),
    tsd    = require('./index.js'),
    jshint = require('gulp-jshint');

gulp.task('tsd', function () {
    return gulp.src('./gulp_tsd.json').pipe(tsd());
});

gulp.task('lint', function () {
    return gulp.src(['index.js', 'lib/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});
