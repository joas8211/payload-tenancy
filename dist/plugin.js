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
exports.tenancy = void 0;
var options_1 = require("./options");
var resource_1 = require("./access/resource");
var tenant_1 = require("./access/tenant");
var user_1 = require("./access/user");
var auth_1 = require("./access/auth");
var resourceTenant_1 = require("./fields/resourceTenant");
var tenantParent_1 = require("./fields/tenantParent");
var userTenant_1 = require("./fields/userTenant");
var tenantSlug_1 = require("./fields/tenantSlug");
var tenantDomains_1 = require("./fields/tenantDomains");
var refreshPermissions_1 = require("./fields/refreshPermissions");
var tenant_2 = require("./hooks/tenant");
var init_1 = require("./hooks/init");
var auth_2 = require("./hooks/auth");
var upload_1 = require("./hooks/upload");
var global_1 = require("./hooks/global");
var overrideFields_1 = require("./utils/overrideFields");
var transformGlobalCollectionField_1 = require("./utils/transformGlobalCollectionField");
var transformGlobalField_1 = require("./utils/transformGlobalField");
var tenancy = function (partialOptions) {
    if (partialOptions === void 0) { partialOptions = {}; }
    return function (config) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        var options = (0, options_1.validateOptions)({ options: partialOptions, config: config });
        var basePath = options.isolationStrategy === "path" && "location" in globalThis
            ? "/" + location.pathname.slice(1).split("/")[0]
            : "";
        return __assign(__assign({}, config), { 
            // Proxy not shared globals to their respective collections.
            globals: ((_a = config.globals) !== null && _a !== void 0 ? _a : []).map(function (global) {
                var _a, _b, _c, _d, _e, _f;
                return options.sharedGlobals.includes(global.slug)
                    ? global
                    : __assign(__assign({}, global), { fields: (0, overrideFields_1.overrideFields)(global.fields.map(transformGlobalField_1.transformGlobalField), [], [
                            (0, resourceTenant_1.createResourceTenantField)({
                                options: options,
                                config: config,
                                global: global,
                            }),
                        ]), hooks: {
                            beforeRead: __spreadArray([
                                (0, global_1.createGlobalBeforeReadHook)({
                                    options: options,
                                    config: config,
                                    global: global,
                                })
                            ], ((_b = (_a = global.hooks) === null || _a === void 0 ? void 0 : _a.beforeRead) !== null && _b !== void 0 ? _b : []), true),
                            beforeChange: __spreadArray(__spreadArray([], ((_d = (_c = global.hooks) === null || _c === void 0 ? void 0 : _c.beforeChange) !== null && _d !== void 0 ? _d : []), true), [
                                (0, global_1.createGlobalBeforeChangeHook)({
                                    options: options,
                                    config: config,
                                    global: global,
                                }),
                            ], false),
                            afterChange: __spreadArray([
                                (0, global_1.createGlobalAfterChangeHook)({
                                    options: options,
                                    config: config,
                                    global: global,
                                })
                            ], ((_f = (_e = global.hooks) === null || _e === void 0 ? void 0 : _e.afterChange) !== null && _f !== void 0 ? _f : []), true),
                        } });
            }), collections: __spreadArray(__spreadArray([], ((_b = config.globals) !== null && _b !== void 0 ? _b : [])
                .filter(function (global) { return !options.sharedGlobals.includes(global.slug); })
                .map(function (global) { return ({
                slug: global.slug + "Globals",
                versions: global.versions,
                fields: (0, overrideFields_1.overrideFields)(global.fields.map(transformGlobalCollectionField_1.transformGlobalCollectionField), [], [
                    (0, resourceTenant_1.createResourceTenantField)({
                        options: options,
                        config: config,
                    }),
                ]),
                access: {
                    create: function () { return false; },
                    read: function () { return false; },
                    update: function () { return false; },
                    delete: function () { return false; },
                },
            }); }), true), ((_c = config.collections) !== null && _c !== void 0 ? _c : [])
                .map(function (collection) {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
                return collection.slug === options.tenantCollection
                    ? // Modify tenant collection
                     __assign(__assign({}, collection), { access: __assign(__assign({}, collection.access), { read: (0, tenant_1.createTenantReadAccess)({
                                options: options,
                                config: config,
                                original: (_a = collection.access) === null || _a === void 0 ? void 0 : _a.read,
                            }), update: (0, tenant_1.createTenantReadAccess)({
                                options: options,
                                config: config,
                                original: (_b = collection.access) === null || _b === void 0 ? void 0 : _b.update,
                            }), delete: (0, tenant_1.createTenantDeleteAccess)({
                                options: options,
                                config: config,
                                original: (_c = collection.access) === null || _c === void 0 ? void 0 : _c.delete,
                            }) }), fields: (0, overrideFields_1.overrideFields)(collection.fields, [
                            (0, tenantSlug_1.createTenantSlugField)({ options: options, config: config, collection: collection }),
                            (0, tenantParent_1.createTenantParentField)({ options: options, config: config, collection: collection }),
                            (0, tenantDomains_1.createTenantDomainsField)({ options: options, config: config, collection: collection }),
                            (0, refreshPermissions_1.createRefreshPermissionsField)({
                                options: options,
                                config: config,
                                collection: collection,
                            }),
                        ], []), hooks: __assign(__assign({}, collection.hooks), { afterChange: __spreadArray(__spreadArray([], (((_d = collection.hooks) === null || _d === void 0 ? void 0 : _d.afterChange) || []), true), [
                                (0, tenant_2.createTenantAfterChangeHook)({
                                    options: options,
                                    config: config,
                                }),
                            ], false), beforeDelete: __spreadArray(__spreadArray([], (((_e = collection.hooks) === null || _e === void 0 ? void 0 : _e.beforeDelete) || []), true), [
                                (0, tenant_2.createTenantBeforeDeleteHook)({
                                    options: options,
                                    config: config,
                                }),
                            ], false) }), admin: __assign(__assign({}, collection.admin), { disableDuplicate: true }) }) : collection.auth
                    ? // Modify user collections
                     __assign(__assign({}, collection), { access: __assign(__assign({}, collection.access), { create: (0, user_1.createUserCreateAccess)({
                                options: options,
                                config: config,
                                original: (_f = collection.access) === null || _f === void 0 ? void 0 : _f.create,
                            }), read: (0, user_1.createUserReadAccess)({
                                options: options,
                                config: config,
                                original: (_g = collection.access) === null || _g === void 0 ? void 0 : _g.read,
                            }), update: (0, user_1.createUserReadAccess)({
                                options: options,
                                config: config,
                                original: (_h = collection.access) === null || _h === void 0 ? void 0 : _h.update,
                            }), delete: (0, user_1.createUserReadAccess)({
                                options: options,
                                config: config,
                                original: (_j = collection.access) === null || _j === void 0 ? void 0 : _j.delete,
                            }), admin: (0, auth_1.createAdminAccess)({
                                options: options,
                                config: config,
                                original: (_k = collection.access) === null || _k === void 0 ? void 0 : _k.admin,
                            }) }), fields: (0, overrideFields_1.overrideFields)(collection.fields, [], [(0, userTenant_1.createUserTenantField)({ options: options, config: config, collection: collection })]), hooks: __assign(__assign({}, collection.hooks), { beforeLogin: __spreadArray(__spreadArray([], (((_l = collection.hooks) === null || _l === void 0 ? void 0 : _l.beforeLogin) || []), true), [
                                (0, auth_2.createRestrictLogin)({ options: options, config: config }),
                            ], false) }) }) : options.sharedCollections.includes(collection.slug)
                    ? // Do not modify the collection (opt-out)
                        collection
                    : // Modify resource collections
                     __assign(__assign({}, collection), { access: __assign(__assign({}, collection.access), { create: (0, resource_1.createResourceCreateAccess)({
                                options: options,
                                config: config,
                                original: (_m = collection.access) === null || _m === void 0 ? void 0 : _m.create,
                            }), read: (0, resource_1.createResourceReadAccess)({
                                options: options,
                                config: config,
                                original: (_o = collection.access) === null || _o === void 0 ? void 0 : _o.read,
                            }), update: (0, resource_1.createResourceReadAccess)({
                                options: options,
                                config: config,
                                original: (_p = collection.access) === null || _p === void 0 ? void 0 : _p.update,
                            }), delete: (0, resource_1.createResourceReadAccess)({
                                options: options,
                                config: config,
                                original: (_q = collection.access) === null || _q === void 0 ? void 0 : _q.delete,
                            }) }), fields: (0, overrideFields_1.overrideFields)(collection.fields, [], [
                            (0, resourceTenant_1.createResourceTenantField)({
                                options: options,
                                config: config,
                                collection: collection,
                            }),
                        ]) });
            })
                .map(function (collection) {
                var _a, _b, _c, _d;
                if (!collection.upload) {
                    return collection;
                }
                var parameters = typeof collection.upload === "object" ? collection.upload : {};
                return __assign(__assign({}, collection), { upload: __assign(__assign({}, parameters), { staticURL: ((_a = parameters.staticURL) === null || _a === void 0 ? void 0 : _a.startsWith("/")) === false
                            ? parameters.staticURL // Absolute URL
                            : basePath + ((_b = parameters.staticURL) !== null && _b !== void 0 ? _b : "/media") }), hooks: __assign(__assign({}, collection.hooks), { afterRead: __spreadArray([
                            (0, upload_1.createUploadAfterReadHook)({ options: options, config: config, collection: collection })
                        ], ((_d = (_c = collection.hooks) === null || _c === void 0 ? void 0 : _c.afterRead) !== null && _d !== void 0 ? _d : []), true) }) });
            }), true), routes: {
                admin: basePath + ((_e = (_d = config.routes) === null || _d === void 0 ? void 0 : _d.admin) !== null && _e !== void 0 ? _e : "/admin"),
                api: basePath + ((_g = (_f = config.routes) === null || _f === void 0 ? void 0 : _f.api) !== null && _g !== void 0 ? _g : "/api"),
                graphQL: basePath + ((_j = (_h = config.routes) === null || _h === void 0 ? void 0 : _h.graphQL) !== null && _j !== void 0 ? _j : "/graphql"),
                graphQLPlayground: basePath +
                    ((_l = (_k = config.routes) === null || _k === void 0 ? void 0 : _k.graphQLPlayground) !== null && _l !== void 0 ? _l : "/graphql-playground"),
            }, onInit: (0, init_1.createInitHook)({ options: options, config: config }) });
    };
};
exports.tenancy = tenancy;
