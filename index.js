'use strict';

var tsd     = require('./lib/tsd');
var through = require('through2');
var gutil   = require('gulp-util');
var path    = require('path');

module.exports = function () {
    var settings = [];

    var logger = {
        "log": function () {
            var args = Array.prototype.slice.call(arguments);
            args.unshift('['+gutil.colors.cyan('gulp-tsd')+']');
            gutil.log.apply(undefined, args);
        }
    };

    var finished_workers = 0;
    var promised = function (context, promise, callback) {
        promise.done(function () {
            if (settings.length === ++finished_workers) {
                logger.log('finish');
                return callback();
            }
        }, function (err) {
            if (settings.length === ++finished_workers) {
                context.emit('error', new gutil.PluginError('gulp-tsd', 'Failed command execution: ' + err.stack));
                return callback();
            }
        });
    };

    function transform(file, encode, callback) {
        if (file.isNull()) {
            this.push(file);
            return callback();
        }

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError('gulp-tsd', 'Streaming not supported'));
            return callback();
        }

        settings.push(require(path.resolve(file.relative)));

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

