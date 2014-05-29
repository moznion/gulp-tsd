var gulp = require('gulp');
var tsd = require('../index');
var clean = require('gulp-clean');

gulp.task('clean', function () {
    return gulp.src('typings', { read: false }).pipe(clean());
});

gulp.start('clean');

// var chai = require('chai');
// chai.should();
//
//
// tsd();
// var foo = "higeu";
// describe('Array', function(){
//     it('should return -1 when the value is not present', function() {
//         tsd();
//     })
// })
