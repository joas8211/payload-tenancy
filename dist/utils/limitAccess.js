"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.limitAccess = void 0;
/**
 * @param originalResult Original access control (query condition or boolean
 *   result) to take into account.
 * @param condition Query condition for limiting the original access control.
 * @returns Limited access control.
 */
var limitAccess = function (originalResult, condition) {
    if (originalResult === void 0) { originalResult = true; }
    if (originalResult === false) {
        return false;
    }
    if (originalResult === true) {
        return condition;
    }
    return { and: [originalResult, condition] };
};
exports.limitAccess = limitAccess;
