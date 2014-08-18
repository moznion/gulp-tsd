# gulp-tsd [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]

Gulp plugin to automate TSD and TypeScript definition related tasks

## GETTING START

### 1. Install `gulp-tsd`

    npm install --save-dev gulp-tsd

### 2. Write `gulpfile.js`

For example;

```javascript
var tsd = require('gulp-tsd');

gulp.task('tsd', function () {
    return gulp.src('./gulp_tsd.json').pipe(tsd());
});
```

or if you want to specify your options inline in your gulpfile

```javascript
var tsd = require('gulp-tsd');

gulp.task('tsd', function (callback) {
    tsd({
        command: 'reinstall',
        config: './tsd.json'
    }, callback);
});
```

### 3. Write `gulp_tsd.json` (see blow)

### 4. Write `tsd.json` (see below)

### 5. Run!

## DESCRIPTION

### gulp_tsd.json (convenient name, you can give a name as you like)

Setting file for this plugin.
Pass this file to entry point of this plugin through `gulp.src`.

e.g.

```json
    {
        "command": "reinstall", // this plugin supports only "reinstall"
        "latest": true,         // if this property is true, tsd always fetches HEAD definitions
        "config": "./tsd.json", // file path for configuration file (see below)
        "opts": {
            // options, EXPERIMENTAL
        }
    }
```


### tsd.json (convenient name, you can give a name as you like)

Configuration file for [tsd](https://github.com/DefinitelyTyped/tsd).
Specify this file by setting json (yes, above one).

e.g.

```json
{
    "version": "v4",
    "repo": "borisyankov/DefinitelyTyped",
    "ref": "master",
    "path": "typings",
    "bundle": "typings/tsd.d.ts",
    "installed": {
        "jquery/jquery.d.ts": {
            "commit": "0de1592ef9e3144b925287ca0494f621e12b01c6"
        }
    }
}
```

Please refer to the [tsd.json](https://github.com/DefinitelyTyped/tsd#tsdjson) to get more information.

## NOTES

A lot of codes are from [grunt-tsd](https://github.com/DefinitelyTyped/grunt-tsd). Thanks.

## SEE ALSO

- [tsd](https://github.com/DefinitelyTyped/tsd)
- [grunt-tsd](https://github.com/DefinitelyTyped/grunt-tsd)

## LICENSE

MIT

[npm-url]: https://npmjs.org/package/gulp-tsd
[npm-image]: https://badge.fury.io/js/gulp-tsd.svg
[travis-url]: https://travis-ci.org/moznion/gulp-tsd
[travis-image]: https://travis-ci.org/moznion/gulp-tsd.svg?branch=master
[daviddm-url]: https://david-dm.org/moznion/gulp-tsd
[daviddm-image]: https://david-dm.org/moznion/gulp-tsd.svg
