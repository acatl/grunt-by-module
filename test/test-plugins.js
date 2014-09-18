/*jslint node: true */
'use strict';

var should = require('should');
var _ = require('lodash');

var grunt = require('grunt');

var ModuleLoading = require('../lib/module-loading');
var Plugins = require('../lib/plugins');

var TestData = {};

describe('Plugins', function() {
    before(function() {
        TestData.pluginPath = __dirname + '/assets/plugins';
        TestData.pluginFiles = ModuleLoading.getPaths(TestData.pluginPath);

        TestData.tasksPath = __dirname + '/assets/tasks';
        TestData.taskFiles = ModuleLoading.getPaths(TestData.tasksPath);

        TestData.gruntConfig = {};
        TestData.plugins = [];
    });


    describe('#pluginFactory', function() {
        before(function() {
            var resource = TestData.pluginFiles[0];

            var module = ModuleLoading.requireResource(resource);
            TestData.plugin = Plugins.pluginFactory(module, resource);
        });

        it('should return a Plugin', function() {
            TestData.plugin.should.be.instanceof(Plugins.Plugin);
        });

        it('should load task', function() {
            _.every(_.keys(TestData.plugin)).should.be.ok;
        });
    });

    describe('#loadPlugins', function() {
        before(function() {
            TestData.plugins = Plugins.loadPlugins('test/assets/plugins');
        });

        it('should return array of plugins', function() {
            TestData.plugins.should.be.instanceof(Array);
        });

        it('should be a collection of Plugin objects', function() {
            TestData.plugins.should.not.be.empty;
            TestData.plugins[0].should.be.instanceof(Plugins.Plugin);
        });

        it('should have valid plugin objects', function() {
            TestData.plugins[0].should.be.eql({
                name: 'concat',
                npmTaskName: 'grunt-contrib-concat',
                config: {
                    options: {
                        separator: ';'
                    }
                }
            });
        });

    });

    describe('#appendPlugin', function() {
        it('should add plugin to target', function() {
            var plugin = new Plugins.Plugin('testPlugin', 'testTask', {
                options: {}
            });
            var result = Plugins.appendPlugin({}, plugin);
            result.should.have.property('testPlugin');
        });

        it('should extend existing plugin to target', function() {
            var plugin = new Plugins.Plugin('testPlugin', 'testTask', {
                options: {}
            });
            var result = Plugins.appendPlugin({
                'testPlugin': {
                    value: 1
                }
            }, plugin);
            result.should.have.property('testPlugin');

            var testPlugin = result.testPlugin;
            testPlugin.should.have.keys('options', 'value');
        });
    });


    describe('#appendPlugins', function() {
        it('should add plugin collection to target', function() {
            var plugins = [
                new Plugins.Plugin('testPlugin1', 'testTask1', {}),
                new Plugins.Plugin('testPlugin2', 'testTask2', {})
            ];

            var result = Plugins.appendPlugins({}, plugins);
            result.should.have.keys('testPlugin1', 'testPlugin2');
        });
    });
});
