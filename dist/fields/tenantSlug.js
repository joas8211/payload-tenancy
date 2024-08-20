"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTenantSlugField = void 0;
var mergeObjects_1 = require("../utils/mergeObjects");
var noSpace = /^[^ ]+$/;
/** @returns Slug field for tenants. */
var createTenantSlugField = function (_a) {
    var collection = _a.collection;
    return (0, mergeObjects_1.mergeObjects)({
        type: "text",
        name: "slug",
        unique: true,
        required: true,
        validate: function (value) {
            if (!value)
                return "Slug is required";
            if (!noSpace.test(value))
                return "Slug cannot contain space characters";
            return true;
        },
    }, collection.fields.find(function (field) { return "name" in field && field.name === "slug"; }));
};
exports.createTenantSlugField = createTenantSlugField;
