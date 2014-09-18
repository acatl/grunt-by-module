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

function getMainPackage(grunt) {
    var pkg = grunt.file.readJSON('package.json');
    return pkg;
}

function getSettings(options) {
    var settings = _.merge({}, DefaultSettings, options);
    return settings;
}
exports.getSettings = getSettings;


function setupPackageInfo(settings, grunt) {
    var packageKey = settings.packageKey || 'pkg';
    settings.config[packageKey] = getMainPackage(grunt);
    return settings;
}


function registerPlugins(settings, grunt) {
    var plugins = Plugins.loadPlugins(settings.pluginsPath);

    settings.config = settings.config || {};
    Plugins.appendPlugins(settings.config, plugins);

    Plugins.registerPlugins(grunt, plugins);

    return settings;
}
exports.registerPlugins = registerPlugins;

function registerTasks(settings, grunt) {
    var tasks = Tasks.loadTasks(settings.tasksPath);

    settings.config = settings.config || {};
    Tasks.appendTasks(settings.config, tasks);

    Tasks.registerTasks(grunt, tasks);

    return settings;
}
exports.registerTasks = registerTasks;


function config(grunt, options) {

    var settings = getSettings(options);


    setupPackageInfo(settings, grunt);

    registerPlugins(settings, grunt);
    registerTasks(settings, grunt);

    grunt.initConfig(settings.config);
}
exports.config = config;
