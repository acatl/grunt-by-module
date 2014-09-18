/*jslint node: true */
'use strict';

var should = require('should');
var ModuleLoading = require('../lib/module-loading');

var grunt = require('grunt');

var TestData = {};

describe('module-loading', function() {
    describe('#getPaths', function() {
        before(function() {
            var pluginsPath = __dirname + '/assets/plugins';
            var pluginPaths = ModuleLoading.getPaths(pluginsPath);
            TestData.pluginPaths = pluginPaths;
        });

        it('should return array of module pluginPaths', function() {
            TestData.pluginPaths.should.be.instanceof(Array);
        });

        it('should filter only .js files', function() {
            TestData.pluginPaths.length.should.be.eql(2);
        });
    });

    describe('#requireResource', function() {
        before(function() {
            var resource = TestData.pluginPaths[0];

            TestData.module = ModuleLoading.requireResource(resource);
        });

        it('should load module', function() {
            TestData.module.should.be.ok;
            Object.keys(TestData.module).length.should.be.greaterThan(0);
        });
    });

    describe('#loadResources', function() {
        before(function() {
            function ModuleTest(source) {
                this.source = source;
            }

            function objectFactory(source) {
                return new ModuleTest(source);
            }

            TestData.ModuleTest = ModuleTest;
            TestData.tasks = ModuleLoading.loadResources('test/assets/tasks', objectFactory);
        });

        it('should load tasks', function() {
            TestData.tasks.should.not.be.empty;
        });

        it('should each ask be instance of Task', function() {
            TestData.tasks[0].should.be.instanceof(TestData.ModuleTest);
        });

        it('should get module by factory', function() {
            var task = TestData.tasks[0];
            task.source.should.have.properties('tasks', 'register');
        });
    });

});
