'use strinct';

function getRunner(gutil) {
    var tsd = require('tsd');

    var log = function () {
        var args = Array.prototype.slice.call(arguments);
        args.unshift('['+gutil.colors.cyan('gulp-tsd')+']');
        gutil.log.apply(undefined, args);
    }

    function getAPI(setting) {
        log('config:', setting.config);
        var api = tsd.getAPI(setting.config);
        if (setting.cacheDir) {
            log('cacheDir:', setting.cacheDir);
            api.context.paths.cacheDir = path.resolve(setting.cacheDir);
        }
        return api;
    }

    function reinstall(setting) {
        log('execute command: reinstall');

        var api = getAPI(setting);
        return api.readConfig(setting.config, true).then(function () {
            var opts = tsd.Options.fromJSON(setting.opts);
            opts.overwriteFiles = true;
            opts.resolveDependencies = true;
            opts.saveToConfig = true;

            var is_latest = setting.latest;
            log('latest:', is_latest);
            log('running...');
            if (is_latest) {
                var query = new tsd.Query();
                api.context.config.getInstalled().forEach(function (inst) {
                    var def = tsd.Def.getFrom(inst.path);
                    query.addNamePattern(def.project + '/' + def.name);
                });
                query.versionMatcher = new tsd.VersionMatcher('latest');

                return api.select(query, opts).then(function (selection) {
                    return api.install(selection, opts);
                });
            }
            return api.reinstall(opts);
        });
    }

    return {
        getAPI: getAPI,
        commands: {
            reinstall: reinstall
        }
    };
}

module.exports = {
    getRunner: getRunner
};

