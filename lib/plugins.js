'use strict';

var _ = require('lodash');
var Util = require('util');

var walk = require('fs-walk');
var path = require('path');

var ModuleLoading = require('./module-loading');

function invalidPluginError(taskName) {
    var message = Util.format('Plugin \'%s\' must have \'task\' property, and be a valid Grunt task name', taskName);
    var error = new Error();
    error.name = 'InvalidPlugin';
    error.message = message;

    return error;
}
exports.invalidPluginError = invalidPluginError;


function Plugin(name, npmTaskName, config) {
    this.name = name;
    this.npmTaskName = npmTaskName;
    this.config = config;
}
exports.Plugin = Plugin;


function pluginFactory(module, resource) {
    var taskName = resource.basename;

    if (!module.task) {
        throw invalidPluginError(taskName);
    }

    var taskOptions = _.omit(module, 'task');

    var plugin = new Plugin(taskName, module.task, taskOptions);

    return plugin;
}
exports.pluginFactory = pluginFactory;


function loadPlugins(basedir) {
    return ModuleLoading.loadResources(basedir, pluginFactory);
}
exports.loadPlugins = loadPlugins;

function loadNpmPluginTask(grunt, plugin) {
    grunt.loadNpmTasks(plugin.npmTaskName);
    return grunt;
}

function registerPlugins(grunt, plugins) {
    _.forEach(plugins, _.partial(loadNpmPluginTask, grunt));
    return grunt;
}
exports.registerPlugins = registerPlugins;


function appendPlugin(config, plugin) {
    var configPlugin = config[plugin.name] = config[plugin.name] || {};
    _.extend(configPlugin, plugin.config);
    return config;
}
exports.appendPlugin = appendPlugin;

function appendPlugins(config, plugins) {
    _.forEach(plugins, _.partial(appendPlugin, config));
    return config;
}
exports.appendPlugins = appendPlugins;
