'use strict';

var _ = require('lodash');

function hasConflicts(target, source) {
    var found = _.some(source, function(val, key) {
        return target.hasOwnProperty(key);
    });

    return found;
}
exports.hasConflicts = hasConflicts;
