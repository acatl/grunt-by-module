'use strict';

var _ = require('lodash');
var Util = require('util');

var walk = require('fs-walk');
var path = require('path');

var ModuleLoading = require('./module-loading');

/**
 * create invalid plugin error object
 * @param  {String} taskName
 * @return {Error}
 */
function invalidPluginError(taskName) {
    var message = Util.format('Plugin \'%s\' must have \'task\' property, and be a valid Grunt task name', taskName);
    var error = new Error();
    error.name = 'InvalidPlugin';
    error.message = message;

    return error;
}
exports.invalidPluginError = invalidPluginError;

/**
 * Constructor
 * @param {String} name
 * @param {String} npmTaskName
 * @param {Object} config task options
 */
function Plugin(name, npmTaskName, config) {
    this.name = name;
    this.npmTaskName = npmTaskName;
    this.config = config;
}
exports.Plugin = Plugin;

/**
 * creates a Plugin instance
 * @param  {Object} module Plugin Config object
 * @param  {Resource} resource
 * @return {Plugin}
 */
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

/**
 * load available Plugins
 * @param  {String} basedir
 * @return {Array} collection of Plugins
 */
function loadPlugins(basedir) {
    return ModuleLoading.loadResources(basedir, pluginFactory);
}
exports.loadPlugins = loadPlugins;

/**
 * load grunt task from plugin
 * @param  {Grunt} grunt
 * @param  {Plugin} plugin
 * @return {Grunt}
 */
function loadNpmPluginTask(grunt, plugin) {
    grunt.loadNpmTasks(plugin.npmTaskName);
    return grunt;
}

/**
 * register avail Plugins into Grunt
 * @param  {Grunt} grunt
 * @param  {Array} plugins
 * @return {Grunt}
 */
function registerPlugins(grunt, plugins) {
    _.forEach(plugins, _.partial(loadNpmPluginTask, grunt));
    return grunt;
}
exports.registerPlugins = registerPlugins;

/**
 * append Plugin info to Config object
 * @param  {Object} config
 * @param  {Plugin} plugin
 * @return {Object}
 */
function appendPlugin(config, plugin) {
    var configPlugin = config[plugin.name] = config[plugin.name] || {};
    _.extend(configPlugin, plugin.config);
    return config;
}
exports.appendPlugin = appendPlugin;

/**
 * append collection of Plugins to config object
 * @param  {Object} config
 * @param  {Array} plugins
 * @return {Object}
 */
function appendPlugins(config, plugins) {
    _.forEach(plugins, _.partial(appendPlugin, config));
    return config;
}
exports.appendPlugins = appendPlugins;
