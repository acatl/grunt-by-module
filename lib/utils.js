'use strict';

var _ = require('lodash');

/**
 * checks if `source` has conflicting (matching) properties on `target`
 * @param  {Object}  target
 * @param  {Object}  source
 * @return {Boolean}
 */
function hasConflicts(target, source) {
    var found = _.some(source, function(val, key) {
        return target.hasOwnProperty(key);
    });

    return found;
}
exports.hasConflicts = hasConflicts;
