"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTenantDomainsField = void 0;
var mergeObjects_1 = require("../utils/mergeObjects");
var createTenantDomainsField = function (_a) {
    var collection = _a.collection;
    return (0, mergeObjects_1.mergeObjects)({
        type: "array",
        name: "domains",
        fields: [
            {
                type: "text",
                name: "domain",
                required: true,
            },
        ],
        admin: {
            components: {
                RowLabel: function (_a) {
                    var data = _a.data;
                    return data.domain || "New Domain";
                },
            },
        },
    }, collection.fields.find(function (field) { return "name" in field && field.name == "domains"; }));
};
exports.createTenantDomainsField = createTenantDomainsField;
