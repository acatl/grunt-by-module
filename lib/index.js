'use strict';

var _ = require('lodash');
var Util = require('util');

var walk = require('fs-walk');
var path = require('path');

var ModuleLoading = require('./module-loading');
var Plugins = require('./plugins');
var Tasks = require('./tasks');

var DefaultSettings = {
    packageKey: 'pkg',
    pluginsPath: '/grunt/plugins',
    tasksPath: '/grunt/tasks',
    config: {}
};

/**
 * Get main `package.json` JSON
 *
 * @param  {Grunt} grunt
 * @return {Object}
 */
function getMainPackage(grunt) {
    var pkg = grunt.file.readJSON('package.json');
    return pkg;
}

/**
 * get settings object based on options passed, uses `DefaultSettings` to set
 * default values of the object.
 *
 * @param  {Object} options
 * @return {Object}
 */
function getSettings(options) {
    var settings = _.merge({}, DefaultSettings, options);
    return settings;
}
exports.getSettings = getSettings;

/**
 * sets `package.json` property to config object
 *
 * @param  {Object} settings
 * @param  {Grunt} grunt
 * @return {Object}
 */
function setupPackageInfo(settings, grunt) {
    var packageKey = settings.packageKey || 'pkg';
    settings.config[packageKey] = getMainPackage(grunt);
    return settings;
}

/**
 * Registers available plugins
 *
 * @param  {Object} settings
 * @param  {Grunt} grunt
 * @return {Settings}
 */
function registerPlugins(settings, grunt) {
    var plugins = Plugins.loadPlugins(settings.pluginsPath);

    settings.config = settings.config || {};
    Plugins.appendPlugins(settings.config, plugins);

    Plugins.registerPlugins(grunt, plugins);

    return settings;
}
exports.registerPlugins = registerPlugins;

/**
 * Registers available tasks
 *
 * @param  {Object} settings
 * @param  {Grunt} grunt
 * @return {Object}
 */
function registerTasks(settings, grunt) {
    var tasks = Tasks.loadTasks(settings.tasksPath);

    settings.config = settings.config || {};
    Tasks.appendTasks(settings.config, tasks);

    Tasks.registerTasks(grunt, tasks);

    return settings;
}
exports.registerTasks = registerTasks;

/**
 * Main entrance method to our module, sets up all plugins and tasks
 *
 * @param  {Grunt} grunt
 * @param  {Object} options custom options to override `DefaultSettings` values
 * @return {Grunt}
 */
function config(grunt, options) {

    var settings = getSettings(options);


    setupPackageInfo(settings, grunt);

    registerPlugins(settings, grunt);
    registerTasks(settings, grunt);

    grunt.initConfig(settings.config);

    return grunt;
}
exports.config = config;
