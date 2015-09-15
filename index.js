var tsd     = require('./lib/tsd');
var through = require('through2');
var gutil   = require('gulp-util');
var path    = require('path');

module.exports = function (options, callback) {
    'use strict';

    var settings = options || { command: 'reinstall', latest: false }

    var logger = {
        'log': function () {
            var args = Array.prototype.slice.call(arguments);
            args.unshift('[' + gutil.colors.cyan('gulp-tsd') + ']');
            gutil.log.apply(undefined, args);
        }
    };

    var promised = function (context, promise, callback) {
        promise.done(function () {
           	logger.log('finish');
		return callback();
        }, function (err) {
           	context.emit('error', new gutil.PluginError('gulp-tsd', 'Failed command execution: ' + err.stack));
		return callback();
        });
    };

    function transform(file, encode, callback) {
        /*jshint validthis:true */
        if (file.isNull()) {
            this.push(file);
            return callback();
        }

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError('gulp-tsd', 'Streaming not supported'));
            return callback();
        }

        settings.config = file.path;
        callback();
    }

    function flush(callback) {
        /*jshint validthis:true */
        var self = this;
        if (!settings.config) {
		return callback();
	}
        var command = settings.command;
		var tsdCommand = tsd.getRunner(logger).commands[command];
		if (typeof tsdCommand === 'undefined') {
			self.emit(
				'error',
				new gutil.PluginError('gulp-tsd', '"' + command + '"' + ' command is not supported')
			);
			return callback();
		}

		return promised(self, tsdCommand(settings), callback);
    }

    if (callback) {
        flush(callback);
    }

    return through.obj(transform, flush);
};
