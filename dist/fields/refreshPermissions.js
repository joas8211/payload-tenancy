"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRefreshPermissionsField = void 0;
var mergeObjects_1 = require("../utils/mergeObjects");
var RefreshPermissionsField_1 = require("../components/RefreshPermissionsField");
var createRefreshPermissionsField = function (_a) {
    var collection = _a.collection;
    return (0, mergeObjects_1.mergeObjects)({
        type: "ui",
        name: "refreshPermissions",
        admin: {
            components: {
                Field: RefreshPermissionsField_1.RefreshPermissionsField,
            },
        },
    }, collection.fields.find(function (field) { return "name" in field && field.name == "refreshPermissions"; }));
};
exports.createRefreshPermissionsField = createRefreshPermissionsField;
