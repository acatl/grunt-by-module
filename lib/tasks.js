'use strict';

var _ = require('lodash');
var Util = require('util');

var walk = require('fs-walk');
var path = require('path');

var ModuleLoading = require('./module-loading');
var Utils = require('./utils');

/**
 * Constructor
 *
 * @param {Object} source
 * @param {Resource} resource
 */
function Task(source, resource) {
    this.tasks = source.tasks || {};
    this.register = source.register || {};

    this.resource = resource;
}
exports.Task = Task;

/**
 * creates a Task object
 * @param  {Object} module
 * @param  {Resource} resource
 * @return {Task}
 */
function taskFactory(module, resource) {
    var task = new Task(module, resource);
    return task;
}
exports.taskFactory = taskFactory;

/**
 * Loads Tasks from a directory path
 * @param  {String} basedir
 * @return {Array}
 */
function loadTasks(basedir) {
    return ModuleLoading.loadResources(basedir, taskFactory);
}
exports.loadTasks = loadTasks;

/**
 * creates a task error object to report a conflicting task
 * @param  {String} filename
 * @param  {String} taskName
 * @param  {Object} moduleTask
 * @return {Error}
 */
function conflictingTaskError(filename, taskName, moduleTask) {
    var error = new Error();
    var keys = _.keys(moduleTask).join(',');
    error.name = 'TaskConflicts';
    error.message = Util.format('Module \'%s\' on task \'%s\' has one or more conflicting subtasks: [%s]', filename, taskName, keys);
    error.taskName = taskName;
    error.module = filename;

    return error;
}

/**
 * Check if teh new task will generate any conflicts with the already
 * loaded ones
 *
 * @param  {Object} mainTask
 * @param  {Object} moduleTask
 * @param  {String} taskName
 * @param  {String} filename
 * @return {Boolean}
 */
function checkTaskConflicts(mainTask, moduleTask, taskName, filename) {
    // check for conflicts

    var conflictingTasks = Utils.hasConflicts(mainTask, moduleTask);

    if (conflictingTasks) {
        throw conflictingTaskError(filename, taskName, moduleTask);
    }

    return true;
}

/**
 * appends subtasks to main config object
 *
 * @param  {Object} targetTaskConfig
 * @param  {String} taskName
 * @param  {Task} task
 * @return {Object}
 */
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

/**
 * append Task to main config object
 *
 * @param  {Object} config
 * @param  {Task} task
 * @return {Object}
 */
function appendTask(config, task) {
    _.forEach(task.tasks, function(taskConfig, taskName) {
        var targetTaskConfig = config[taskName] = config[taskName] || {};
        appendSubTasks(targetTaskConfig, taskName, task);
    });

    return config;
}
exports.appendTask = appendTask;

/**
 * append all tasks to main config object
 *
 * @param  {Object} config
 * @param  {Array} tasks
 * @return {Object}
 */
function appendTasks(config, tasks) {
    _.forEach(tasks, _.partial(appendTask, config));
    return config;
}
exports.appendTasks = appendTasks;

/**
 * register Grunt tasks
 *
 * @param  {Grunt} grunt
 * @param  {Array|Function} task
 * @param  {String} name
 * @return {Grunt}
 */
function registerGruntTask(grunt, task, name) {
    grunt.registerTask(name, task);
    return grunt;
}

/**
 * register tasks found on each `Task.register` object
 *
 * @param  {Grunt} grunt
 * @param  {Task} task
 * @return {Grunt}
 */
function registerGruntTasks(grunt, task) {
    _.forEach(task.register, _.partial(registerGruntTask, grunt));
    return grunt;
}

/**
 * register Grunt Tasks for a Tasks collection
 * @param  {Grunt} grunt
 * @param  {Tasks} tasks
 * @return {Object}
 */
function registerTasks(grunt, tasks) {
    _.forEach(tasks, _.partial(registerGruntTasks, grunt));
}
exports.registerTasks = registerTasks;



