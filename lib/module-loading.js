'use strict';

var _ = require('lodash');
var Util = require('util');

var walk = require('fs-walk');
var path = require('path');

function Resource(source) {
    this.basedir = source.basedir;
    this.filename = source.filename;
    this.basename = source.basename;
}
exports.Resource = Resource;

function getPaths(pathDir) {
    var paths = [];

    walk.filesSync(pathDir, function(basedir, filename, stat, next) {
        if (path.extname(filename) === '.js') {
            var baseName = path.basename(filename, '.js');

            paths.push(new Resource({
                basedir: basedir,
                filename: filename,
                basename: baseName
            }));
        }
    }, function(err) {
        if (err) {
            console.log(err);
        }
    });

    return paths;
}
exports.getPaths = getPaths;


function requireResource(resource) {
    var relativeDir = path.relative(__dirname, resource.basedir);
    var modulePath = path.join(relativeDir, resource.filename);
    var module = require(modulePath);
    return module;
}
exports.requireResource = requireResource;

function resourceFactory(objectFactory, resource) {
    var source = requireResource(resource);
    return objectFactory(source, resource);
}
exports.resourceFactory = resourceFactory;

function loadResources(basedir, objectFactory) {
    var resourcesDir = path.resolve(basedir);

    var resources = getPaths(resourcesDir);

    var tasks = _.map(resources, _.partial(resourceFactory, objectFactory));

    return tasks;
}
exports.loadResources = loadResources;
