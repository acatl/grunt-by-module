'use strict';

var _ = require('lodash');
var Util = require('util');

var walk = require('fs-walk');
var path = require('path');

var ModuleLoading = require('./module-loading');
var Utils = require('./utils');

function Task(source, resource) {
    this.tasks = source.tasks || {};
    this.register = source.register || {};

    this.resource = resource;
}
exports.Task = Task;

function taskFactory(module, resource) {
    var task = new Task(module, resource);
    return task;
}
exports.taskFactory = taskFactory;

var getTaskFiles = ModuleLoading.getPaths;

function loadTasks(basedir) {
    return ModuleLoading.loadResources(basedir, taskFactory);
}
exports.loadTasks = loadTasks;

function conflictingTaskError(filename, taskName, moduleTask) {
    var error = new Error();
    var keys = _.keys(moduleTask).join(',');
    error.name = 'TaskConflicts';
    error.message = Util.format('Module \'%s\' on task \'%s\' has one or more conflicting subtasks: [%s]', filename, taskName, keys);
    error.taskName = taskName;
    error.module = filename;

    return error;
}

function checkTaskConflicts(mainTask, moduleTask, taskName, filename) {
    // check for conflicts

    var conflictingTasks = Utils.hasConflicts(mainTask, moduleTask);

    if (conflictingTasks) {
        throw conflictingTaskError(filename, taskName, moduleTask);
    }

    return true;
}

function appendSubTasks(targetTaskConfig, taskName, task) {
    var taskConfig = task.tasks[taskName];
    var filename = task.resource.filename;

    // will thorow an error if has conflicts
    checkTaskConflicts(targetTaskConfig, taskConfig, taskName, filename);

    // overwrite task defintion
    _.extend(targetTaskConfig, taskConfig);

    return targetTaskConfig;
}
exports.appendSubTasks = appendSubTasks;


function appendTask(config, task) {
    _.forEach(task.tasks, function(taskConfig, taskName) {
        var targetTaskConfig = config[taskName] = config[taskName] || {};
        appendSubTasks(targetTaskConfig, taskName, task);
    });

    return config;
}
exports.appendTask = appendTask;


function appendTasks(config, tasks) {
    _.forEach(tasks, _.partial(appendTask, config));
    return config;
}
exports.appendTasks = appendTasks;

function registerGruntTask(grunt, task, name) {
    grunt.registerTask(name, task);
    return grunt;
}

function registerGruntTasks(grunt, task) {
    _.forEach(task.register, _.partial(registerGruntTask, grunt));
    return grunt;
}

function registerTasks(grunt, tasks) {
    _.forEach(tasks, _.partial(registerGruntTasks, grunt));
}
exports.registerTasks = registerTasks;



