"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createResourceTenantField = void 0;
var mergeObjects_1 = require("../utils/mergeObjects");
/** @returns Tenant field for generic resources. */
var createResourceTenantField = function (_a) {
    var _b;
    var tenantCollection = _a.options.tenantCollection, collection = _a.collection, global = _a.global;
    return (0, mergeObjects_1.mergeObjects)({
        type: "relationship",
        name: "tenant",
        relationTo: tenantCollection,
        hidden: true,
        hooks: {
            beforeChange: [
                function (_a) {
                    var _b;
                    var req = _a.req;
                    // Assign tenant to the document when it's created (or updated).
                    var _c = req, tenant = _c.tenant, user = _c.user;
                    return (tenant === null || tenant === void 0 ? void 0 : tenant.id) || ((_b = user === null || user === void 0 ? void 0 : user.tenant) === null || _b === void 0 ? void 0 : _b.id);
                },
            ],
        },
    }, (_b = (collection !== null && collection !== void 0 ? collection : global)) === null || _b === void 0 ? void 0 : _b.fields.find(function (field) { return "name" in field && field.name === "tenant"; }));
};
exports.createResourceTenantField = createResourceTenantField;
