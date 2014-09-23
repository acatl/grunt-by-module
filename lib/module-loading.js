'use strict';

var _ = require('lodash');
var Util = require('util');

var walk = require('fs-walk');
var path = require('path');

/**
 * Constructor
 * @param {Object} source
 */
function Resource(source) {
    this.basedir = source.basedir;
    this.filename = source.filename;
    this.basename = source.basename;
}
exports.Resource = Resource;

/**
 * gets a collection of Paths for valid modules under a directory
 * @param  {String} pathDir
 * @return {Array}
 */
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
            console.error(err);
            throw err;
        }
    });

    return paths;
}
exports.getPaths = getPaths;

/**
 * requires(Node module) a resource and returns it
 * @param  {Resource} resource
 * @return {Object}
 */
function requireResource(resource) {
    var relativeDir = path.relative(__dirname, resource.basedir);
    var modulePath = path.join(relativeDir, resource.filename);
    var module = require(modulePath);
    return module;
}
exports.requireResource = requireResource;

/**
 * creates an object, delegates the construction to the `objectFactory`
 * parameter.
 *
 * @param  {Function} objectFactory
 * @param  {Resource} resource
 * @return {Object}
 */
function resourceFactory(objectFactory, resource) {
    var source = requireResource(resource);
    return objectFactory(source, resource);
}
exports.resourceFactory = resourceFactory;

/**
 * loads a set of resources and creates an instance of each based on the
 * `objectFactory`
 *
 * @param  {String} basedir
 * @param  {Function} objectFactory
 * @return {Array}
 */
function loadResources(basedir, objectFactory) {
    var resourcesDir = path.resolve(basedir);

    var resources = getPaths(resourcesDir);

    var collection = _.map(resources, _.partial(resourceFactory, objectFactory));

    return collection;
}
exports.loadResources = loadResources;
