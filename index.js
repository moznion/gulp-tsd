'use strict';

var tsd     = require('./lib/tsd');
var through = require('through2');
var gutil   = require('gulp-util');

module.exports = function () {
    var settings = [];

    var logger = {
        "log": function () {
            var args = Array.prototype.slice.call(arguments);
            args.unshift('['+gutil.colors.cyan('gulp-tsd')+']');
            gutil.log.apply(undefined, args);
        }
    };

    var promised = function (context, promise, callback) {
        promise.done(function () {
            logger.log('finish');
            return callback();
        }, function (err) {
            self.emit('error', new gutil.PluginError('gulp-tsd', 'Failed command execution: ' + err.stack));
            return callback();
        });
    }

    function transform(file, encode, callback) {
        if (file.isNull()) {
            this.push(file);
            return callback();
        }

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError('gulp-tsd', 'Streaming not supported'));
            return callback();
        }

        var pathname = './' + file.relative.replace(/\\/g, '/');
        settings.push(require(pathname));

        callback();
    }

    function flush(callback) {
        var self = this;
        settings.forEach(function (setting) {
            var command = setting.command;
            var tsd_command = tsd.getRunner(logger).commands[command];
            if (typeof tsd_command === 'undefined') {
                self.emit('error', new gutil.PluginError('gulp-tsd', '"' + command + '"' + ' command is not supported'));
                return callback();
            }

            return promised(self, tsd_command(setting), callback);
        });
    }

    return through.obj(transform, flush);
}

