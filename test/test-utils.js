/*jslint node: true */
'use strict';

var should = require('should');
var Utils = require('../lib/utils');

var grunt = require('grunt');

var ModuleLoading = require('../lib/module-loading');

var TestData = {};

describe('Utils', function() {
    describe('#hasConflicts', function() {
        it('should return true if there is at least one matching key', function() {
            Utils.hasConflicts({
                a: 1
            }, {
                b: 2,
                a: 2
            }).should.be.ok;
        });

        it('should return false if there are NO matching keys', function() {
            Utils.hasConflicts({
                a: 1
            }, {
                b: 2
            }).should.not.be.ok;
        });
    });
});
