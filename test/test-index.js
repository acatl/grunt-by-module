/*jslint node: true */
'use strict';

var should = require('should');
var index = require('../lib/index');

var grunt = require('grunt');

var ModuleLoading = require('../lib/module-loading');

var TestData = {};

describe('index', function() {
    before(function() {
        TestData.pluginPath = __dirname + '/assets/plugins';
        TestData.pluginFiles = ModuleLoading.getPaths(TestData.pluginPath);

        TestData.tasksPath = __dirname + '/assets/tasks';
        TestData.taskFiles = ModuleLoading.getPaths(TestData.tasksPath);

        TestData.gruntConfig = {};
    });


    describe('#getSettings', function() {
        it('should extend default setting with options passed', function() {
            var settings = index.getSettings({
                packageKey: 'package',
                config: {
                    myProperty: 1
                }
            });

            settings.should.be.eql({
                packageKey: 'package',
                pluginsPath: '/grunt/plugins',
                tasksPath: '/grunt/tasks',
                config: {
                    myProperty: 1
                }
            });
        });
    });


    describe('#registerPlugins', function() {
        before(function() {
            this.existedBefore = grunt.task.exists('concat');

            this.settings = index.getSettings({
                pluginsPath: 'test/assets/plugins',
                tasksPath: 'test/assets/tasks',
            });

            index.registerPlugins(this.settings, grunt);
        });

        it('should register listed npm tasks', function() {
            this.existedBefore.should.not.be.ok;
            var existsNow = grunt.task.exists('concat');
            existsNow.should.be.ok;
        });

        it('should append plugins to settings config', function() {
            this.settings.config.should.have.keys('copy', 'concat');
        });

    });

    describe('#registerTasks', function() {
        before(function() {
            this.existedBefore = grunt.task.exists('concat');

            this.settings = index.getSettings({
                pluginsPath: 'test/assets/plugins',
                tasksPath: 'test/assets/tasks',
            });

            index.registerTasks(this.settings, grunt);
        });

        it('should register local tasks', function() {
            grunt.task.exists('foo1').should.be.ok;
            grunt.task.exists('foo2').should.be.ok;
        });

        it('should append tasks to settings config', function() {
            this.settings.config.copy.should.have.properties('foo1', 'foo2');
            this.settings.config.concat.should.have.properties('foo1', 'foo2');
        });
    });

    describe('#registerTasks', function() {
        before(function() {
            this.existedBefore = grunt.task.exists('concat');

            this.settings = index.getSettings({
                pluginsPath: 'test/assets/plugins',
                tasksPath: 'test/assets/tasks',
            });

            index.registerTasks(this.settings, grunt);
        });

        after(function() {
            grunt.task.renameTask('foo1', 'foo1#index.registerTasks');
            grunt.task.renameTask('foo2', 'foo2#index.registerTasks');
        });

        it('should register local tasks', function() {
            grunt.task.exists('foo1').should.be.ok;
            grunt.task.exists('foo2').should.be.ok;
        });

        it('should append tasks to settings config', function() {
            this.settings.config.copy.should.have.properties('foo1', 'foo2');
            this.settings.config.concat.should.have.properties('foo1', 'foo2');
        });
    });


    describe('#config', function() {
        before(function() {
            this.settings = {
                pluginsPath: 'test/assets/plugins',
                tasksPath: 'test/assets/tasks',
            };

            index.config(grunt, this.settings);
        });

        after(function() {
            grunt.task.renameTask('copy', 'copy#config');
            grunt.task.renameTask('concat', 'concat#config');
            grunt.task.renameTask('foo1', 'foo1#config');
            grunt.task.renameTask('foo2', 'foo2#config');
        });

        it('should register local tasks', function() {
            grunt.task.exists('copy').should.be.ok;
            grunt.task.exists('concat').should.be.ok;
            grunt.task.exists('foo1').should.be.ok;
            grunt.task.exists('foo2').should.be.ok;
        });
    });
});
