var gulp = require('gulp'),
    tsd  = require('./index.js');

gulp.task('tsd', function () {
    return gulp.src('./gulp_tsd.json').pipe(tsd());
});
