/*jslint node: true */
'use strict';

var should = require('should');
var Tasks = require('../lib/tasks');

var grunt = require('grunt');

var ModuleLoading = require('../lib/module-loading');

var TestData = {};

describe('Tasks', function() {
    before(function() {
        TestData.pluginPath = __dirname + '/assets/plugins';
        TestData.pluginFiles = ModuleLoading.getPaths(TestData.pluginPath);

        TestData.tasksPath = __dirname + '/assets/tasks';
        TestData.taskFiles = ModuleLoading.getPaths(TestData.tasksPath);

        TestData.gruntConfig = {};
    });

    describe('#taskFactory', function() {
        before(function() {
            var modulePath = TestData.taskFiles[0];
            TestData.task = Tasks.taskFactory(modulePath);
        });

        it('should be an instance of Task', function() {
            TestData.task.should.be.instanceof(Tasks.Task);
        });
    });

    describe('#loadTasks', function() {
        before(function() {
            TestData.tasks = Tasks.loadTasks('test/assets/tasks');
        });

        it('should return array of tasks', function() {
            TestData.tasks.should.be.instanceof(Array);
        });

        it('should be a collection of Plugin objects', function() {
            TestData.tasks.should.not.be.empty;
            TestData.tasks[0].should.be.instanceof(Tasks.Task);
        });

        it('should have valid plugin objects', function() {
            var task = TestData.tasks[0];
            task.should.have.keys('tasks', 'register', 'resource');
        });
    });

    describe('#appendSubTasks', function() {
        it('should append subtasks', function() {
            var task = TestData.tasks[0];
            this.task = Tasks.appendSubTasks({}, 'copy', task);
        });

        it('should throw error if has conflicting subtasks ', function() {
            /*jshint immed: false */
            (function() {
                var task = TestData.tasks[0];
                this.task = Tasks.appendSubTasks(this.task, 'copy', task);
            }).should.throw();
        });
    });


    describe('#appendTask', function() {
        before(function() {
            this.config = Tasks.appendTask({}, TestData.tasks[0]);
        });

        it('should append subtasks', function() {
            this.config.copy.should.have.properties('foo1');
            this.config.concat.should.have.properties('foo1');
        });
    });

    describe('#appendTasks', function() {
        it('should register all grunt tasks', function() {
            var config = {};
            Tasks.appendTasks(config, TestData.tasks);
            config.copy.should.have.properties('foo1', 'foo2');
            config.concat.should.have.properties('foo1', 'foo2');
        });
    });

    describe('#registerTasks', function() {
        after(function() {
            grunt.task.renameTask('foo1', 'foo1#task.registerTasks');
        });

        it('should register all grunt tasks', function() {
            grunt.task.exists('foo1').should.not.be.ok;
            Tasks.registerTasks(grunt, TestData.tasks);
            grunt.task.exists('foo1').should.be.ok;
        });
    });


});
