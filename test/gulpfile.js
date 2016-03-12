var gulp = require('gulp');
var gutil = require('gulp-util');
var clean = require('gulp-clean');
var fs = require('fs');
var runSequence = require('gulp-run-sequence');

var chai = require('chai');
chai.should();

var tsd = require('../index');

gulp.task('clean', function () {
    return gulp.src('typings*', { read: false }).pipe(clean());
});

gulp.task('default', function () {
    runSequence(
        'clean',
        'reinstall',
        'reinstall-no-src',
        'reinstall-test',
        'rebundle-test'
    );
});

gulp.task('reinstall', function () {
    return gulp.src('gulp_tsd*.json').pipe(tsd({
        command: 'reinstall',
        latest: false,
        config: './tsd_from_options.json',
    }));
});

gulp.task('reinstall-no-src', function (callback) {
    tsd({
        command: 'reinstall',
        latest: false,
        config: './tsd_from_options_without_src.json',
    }, callback);
});

gulp.task('reinstall-test', function () {
    expectInstalledFilesExist('revision specified files are install in successfully', [
        "./typings/jquery/jquery.d.ts",
        "./typings/goJS/goJS.d.ts"
    ]);

    expectInstalledFilesExist('latest files are install in successfully', [
        "./typings_latest/tsd.d.ts",
        "./typings_latest/jquery/jquery.d.ts",
        "./typings_latest/goJS/goJS.d.ts"
    ]);

    expectDifferencesBetweenBothFiles('latest file and revision specified file are different', [
        ["./typings/jquery/jquery.d.ts", "./typings_latest/jquery/jquery.d.ts"],
        ["./typings/goJS/goJS.d.ts", "./typings_latest/goJS/goJS.d.ts"]
    ])

    expectInstalledFilesExist('options specified files are installed successfully', [
        "./typings_from_options/jquery/jquery.d.ts",
        "./typings_from_options/goJS/goJS.d.ts"
    ]);

    expectInstalledFilesExist('options specified files are installed successfully without src', [
        "./typings_from_options_without_src/jquery/jquery.d.ts",
        "./typings_from_options_without_src/goJS/goJS.d.ts"
    ]);
});

gulp.task('rebundle-test', function (callback) {
    tsd({
        command: 'rebundle',
        config: './tsd.json',
    }, callback);
});

function expectDifferencesBetweenBothFiles(description, diffTargets) {
    var testNum = 0;
    try {
        diffTargets.forEach(function (diffTargetFiles) {
            var text1 = fs.readFileSync(diffTargetFiles[0], 'utf-8');
            var text2 = fs.readFileSync(diffTargetFiles[1], 'utf-8');
            text1.should.not.be.equals(text2);
            testNum++;
        });
    } catch (err) {
        report('fail', {"description": description, "err": err});
        process.exit(1);
        return;
    }

    report('pass', {"description": description, "testNum": testNum});
}

function expectInstalledFilesExist(description, targetFiles) {
    var testNum = 0;
    try {
        targetFiles.forEach(function (targetFile) {
            fs.existsSync(targetFile).should.be.ok;
            testNum++;
        });
    } catch (err) {
        report('fail', {"description": description, "err": err});
        process.exit(1);
    }
    report('pass', {"description": description, "testNum": testNum});
}

function report(type, args) {
    if (type === 'pass') {
        gutil.log(
            gutil.colors.green("\u2668 PASS:"),
            args.description,
            gutil.colors.magenta('@', args.testNum + ' test(s)')
        );
    }
    else if (type === 'fail') {
        gutil.log(
            gutil.colors.red("\u2620 FAIL:"),
            gutil.colors.magenta(args.err),
            'in', args.description
        );
    }
}

