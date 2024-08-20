"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateOptions = void 0;
/** @returns Validated options with default values filled in. */
var validateOptions = function (_a) {
    var _b, _c, _d;
    var _e = _a.options, _f = _e.tenantCollection, tenantCollection = _f === void 0 ? "tenants" : _f, _g = _e.isolationStrategy, isolationStrategy = _g === void 0 ? "user" : _g, _h = _e.sharedCollections, sharedCollections = _h === void 0 ? [] : _h, _j = _e.sharedGlobals, sharedGlobals = _j === void 0 ? [] : _j, config = _a.config;
    var tenantCollectionExists = (_b = config.collections) === null || _b === void 0 ? void 0 : _b.some(function (collection) { return collection.slug === tenantCollection; });
    if (!tenantCollectionExists) {
        throw new Error("Tenant collection with slug '".concat(tenantCollection, "' does not exist.") +
            " Create it or pass correct options to use tenancy plugin.");
    }
    var authCollectionExists = (_c = config.collections) === null || _c === void 0 ? void 0 : _c.some(function (collection) { return collection.auth; });
    if (!authCollectionExists) {
        throw new Error("No authentication collection exists. Create one to use tenancy plugin.");
    }
    var _loop_1 = function (slug) {
        if (slug === tenantCollection) {
            throw new Error("It's not allowed to share tenant collection between all tenants.");
        }
        if ((_d = config.collections) === null || _d === void 0 ? void 0 : _d.some(function (collection) { return collection.slug === slug && collection.auth; })) {
            throw new Error("It's not allowed to share auth collection between all tenants.");
        }
    };
    for (var _i = 0, sharedCollections_1 = sharedCollections; _i < sharedCollections_1.length; _i++) {
        var slug = sharedCollections_1[_i];
        _loop_1(slug);
    }
    return {
        tenantCollection: tenantCollection,
        isolationStrategy: isolationStrategy,
        sharedCollections: sharedCollections,
        sharedGlobals: sharedGlobals,
    };
};
exports.validateOptions = validateOptions;
