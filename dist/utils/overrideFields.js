"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.overrideFields = void 0;
var overrideFields = function (original, frontOverrides, backOverrides) { return __spreadArray(__spreadArray(__spreadArray([], frontOverrides.filter(function (field) {
    return !original.find(function (otherField) {
        return "name" in field &&
            "name" in otherField &&
            otherField.name === field.name;
    });
}), true), original.map(function (field) {
    return __spreadArray(__spreadArray([], frontOverrides, true), backOverrides, true).find(function (otherField) {
        return "name" in field &&
            "name" in otherField &&
            otherField.name === field.name;
    }) || field;
}), true), backOverrides.filter(function (field) {
    return !original.find(function (otherField) {
        return "name" in field &&
            "name" in otherField &&
            otherField.name === field.name;
    });
}), true); };
exports.overrideFields = overrideFields;
