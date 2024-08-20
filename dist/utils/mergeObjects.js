"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeObjects = void 0;
/**
 * Mutates the destination object to have values from source objects. If
 * property is primitive or missing it's overridden, if it's an array source
 * value is pushed to destination array, if it's an object they are merged the
 * same method.
 *
 * @param destination Object into which to merge the other objects.
 * @param sources Objects that override properties and append values to arrays
 *   of the first object.
 * @returns Destination object.
 */
var mergeObjects = function (destination) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    for (var _a = 0, sources_1 = sources; _a < sources_1.length; _a++) {
        var source = sources_1[_a];
        if (!source) {
            continue;
        }
        for (var key in source) {
            var sourceValue = source[key];
            var destinationValue = destination[key];
            if (
            // Source value is primitive.
            sourceValue === null ||
                typeof sourceValue !== "object" ||
                // Property does not exist in destination.
                !(key in destination) ||
                // Destination value is primitive.
                destinationValue === null ||
                typeof destinationValue !== "object" ||
                // Source value XOR destination value is array.
                sourceValue instanceof Array !== destinationValue instanceof Array) {
                destination[key] = sourceValue;
            }
            else if (
            // Source value AND destination value are arrays.
            sourceValue instanceof Array &&
                destinationValue instanceof Array) {
                destinationValue.push.apply(destinationValue, sourceValue);
            }
            else {
                (0, exports.mergeObjects)(destinationValue, sourceValue);
            }
        }
    }
    return destination;
};
exports.mergeObjects = mergeObjects;
