"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTenantParentField = void 0;
var getAuthorizedTenants_1 = require("../utils/getAuthorizedTenants");
var mergeObjects_1 = require("../utils/mergeObjects");
/**
 * Limits parent field access to users that are on tenant above the accessed
 * tenant.
 */
var createAccess = function (options) {
    return function (_a) {
        var doc = _a.doc, req = _a.req;
        return __awaiter(void 0, void 0, void 0, function () {
            var payload, user, someTenantExist, _b, parentTenantId, authorizedTenants;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        payload = req.payload, user = req.user;
                        _b = payload;
                        if (!_b) return [3 /*break*/, 2];
                        return [4 /*yield*/, payload.find({ req: req, collection: options.tenantCollection })];
                    case 1:
                        _b = (_c.sent())
                            .totalDocs > 0;
                        _c.label = 2;
                    case 2:
                        someTenantExist = _b;
                        if (!someTenantExist)
                            return [2 /*return*/, false];
                        // User must be logged in and have assigned tenant.
                        if (!(user === null || user === void 0 ? void 0 : user.tenant))
                            return [2 /*return*/, false];
                        // Allow tenant creation with parent.
                        if (!doc)
                            return [2 /*return*/, true];
                        // Tenant without parent is the root tenant and it cannot have a parent.
                        if (!doc.parent)
                            return [2 /*return*/, false];
                        parentTenantId = doc.parent.id || doc.parent;
                        return [4 /*yield*/, (0, getAuthorizedTenants_1.getAuthorizedTenants)({
                                options: options,
                                payload: payload,
                                tenantId: user.tenant.id || user.tenant,
                            })];
                    case 3:
                        authorizedTenants = _c.sent();
                        return [2 /*return*/, authorizedTenants.includes(parentTenantId)];
                }
            });
        });
    };
};
var createValidate = function (options) {
    return function (value, _a) {
        var payload = _a.payload, id = _a.id, user = _a.user;
        return __awaiter(void 0, void 0, void 0, function () {
            var someTenantExist, original, authorizedTenants;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (id && value === id)
                            return [2 /*return*/, "Cannot relate to itself"];
                        // Skip the following validations on front-end.
                        if (!payload)
                            return [2 /*return*/, true];
                        return [4 /*yield*/, payload.find({ collection: options.tenantCollection, limit: 0 })];
                    case 1:
                        someTenantExist = (_b.sent())
                            .totalDocs > 0;
                        if (!id && !someTenantExist)
                            return [2 /*return*/, true];
                        if (!id) return [3 /*break*/, 3];
                        return [4 /*yield*/, payload.findByID({
                                collection: options.tenantCollection,
                                id: id,
                            })];
                    case 2:
                        original = _b.sent();
                        // If tenant already exists and is a root tenant, do not allow assigning
                        // parent.
                        if (original && !original.parent) {
                            if (value) {
                                return [2 /*return*/, "Cannot assign parent to root tenant"];
                            }
                            return [2 /*return*/, true];
                        }
                        _b.label = 3;
                    case 3:
                        // At this point, the tenant must not be a root tenant. Check that it has a
                        // parent.
                        if (!value) {
                            return [2 /*return*/, "Required"];
                        }
                        // After this all further validations are focusing on the user. If there's
                        // no user, the action is done programmatically and it's ok.
                        if (!user)
                            return [2 /*return*/, true];
                        // At this stage if user has no tenant, user has already created the root
                        // tenant and is trying to create another tenant, but somehow the tenant is
                        // not assigned to the user.
                        if (!user.tenant) {
                            return [2 /*return*/, "Active user is missing tenant"];
                        }
                        return [4 /*yield*/, (0, getAuthorizedTenants_1.getAuthorizedTenants)({
                                options: options,
                                payload: payload,
                                tenantId: user.tenant.id || user.tenant,
                            })];
                    case 4:
                        authorizedTenants = _b.sent();
                        if (!authorizedTenants.includes(value))
                            return [2 /*return*/, "Unauthorized"];
                        // All good :)
                        return [2 /*return*/, true];
                }
            });
        });
    };
};
/** @returns Parent field for tenants. */
var createTenantParentField = function (_a) {
    var options = _a.options, collection = _a.collection;
    return (0, mergeObjects_1.mergeObjects)({
        type: "relationship",
        name: "parent",
        relationTo: options.tenantCollection,
        required: false,
        filterOptions: function (_a) {
            var id = _a.id;
            return ({ id: { not_equals: id } });
        },
        validate: createValidate(options),
        access: {
            read: createAccess(options),
            update: createAccess(options),
        },
    }, collection.fields.find(function (field) { return "name" in field && field.name == "parent"; }));
};
exports.createTenantParentField = createTenantParentField;
