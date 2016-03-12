'use strict';

var path = require('path');

function getRunner(logger) {
    var tsd = require('tsd');

    function getAPI(setting) {
        logger.log('config:', setting.config);
        var api = tsd.getAPI(setting.config);
        if (setting.cacheDir) {
            logger.log('cacheDir:', setting.cacheDir);
            api.context.paths.cacheDir = path.resolve(setting.cacheDir);
        }
        return api;
    }

    function reinstall(setting) {
        logger.log('execute command: reinstall');

        var api = getAPI(setting);
        return api.readConfig(setting.config, true).then(function () {
            var opts     = tsd.Options.fromJSON(setting.opts);
            var isLatest = setting.latest;
            var query;

            opts.saveBundle = true;
            opts.overwriteFiles = true;
            opts.resolveDependencies = true;

            logger.log('latest:', isLatest);
            logger.log('running...');
            if (isLatest) {
                opts.saveToConfig = true;
                query = new tsd.Query();
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
    
    function rebundle(setting) {
        logger.log('execute command: rebundle');

        var api = getAPI(setting);
        return api.readConfig(setting.config, true).then(function () {
            logger.log('running...');            
            return api.updateBundle(api.context.config.bundle, true);
        });
    }

    return {
        getAPI: getAPI,
        commands: {
            reinstall: reinstall,
            rebundle: rebundle
        }
    };
}

module.exports = {
    getRunner: getRunner
};

