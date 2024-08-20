"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformGlobalCollectionField = void 0;
var types_1 = require("payload/dist/fields/config/types");
var transformGlobalCollectionField = function (field) {
    field = Object.assign({}, field);
    delete field["unique"];
    delete field["saveToJWT"];
    delete field["hooks"];
    delete field["admin"];
    delete field["access"];
    if ((0, types_1.fieldHasSubFields)(field)) {
        field.fields = field.fields.map(exports.transformGlobalCollectionField);
    }
    if ((0, types_1.fieldIsBlockType)(field)) {
        field.blocks = field.blocks.map(function (block) { return (__assign(__assign({}, block), { fields: block.fields.map(exports.transformGlobalCollectionField) })); });
    }
    return field;
};
exports.transformGlobalCollectionField = transformGlobalCollectionField;
