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
exports.createTenantBeforeDeleteHook = exports.createTenantAfterChangeHook = void 0;
/**
 * Assign initial user the first created tenant.
 *
 * @param args Hook args
 * @returns {Promise<void>}
 */
var createTenantAfterChangeHook = function (_a) {
    var tenantCollection = _a.options.tenantCollection, config = _a.config;
    return function (_a) {
        var doc = _a.doc, operation = _a.operation, req = _a.req;
        return __awaiter(void 0, void 0, void 0, function () {
            var payload, tenantCount, authCollections, _i, authCollections_1, collection, users, _b, users_1, id;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (operation !== "create")
                            return [2 /*return*/];
                        payload = req.payload;
                        return [4 /*yield*/, payload.find({ req: req, collection: tenantCollection, limit: 2 })];
                    case 1:
                        tenantCount = (_d.sent()).totalDocs;
                        if (tenantCount !== 1)
                            return [2 /*return*/];
                        authCollections = (_c = config.collections) === null || _c === void 0 ? void 0 : _c.filter(function (collection) { return collection.auth; });
                        _i = 0, authCollections_1 = authCollections;
                        _d.label = 2;
                    case 2:
                        if (!(_i < authCollections_1.length)) return [3 /*break*/, 8];
                        collection = authCollections_1[_i].slug;
                        return [4 /*yield*/, payload.find({ req: req, collection: collection })];
                    case 3:
                        users = (_d.sent()).docs;
                        _b = 0, users_1 = users;
                        _d.label = 4;
                    case 4:
                        if (!(_b < users_1.length)) return [3 /*break*/, 7];
                        id = users_1[_b].id;
                        return [4 /*yield*/, payload.update({
                                req: req,
                                collection: collection,
                                id: id,
                                data: { tenant: doc.id },
                            })];
                    case 5:
                        _d.sent();
                        _d.label = 6;
                    case 6:
                        _b++;
                        return [3 /*break*/, 4];
                    case 7:
                        _i++;
                        return [3 /*break*/, 2];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
};
exports.createTenantAfterChangeHook = createTenantAfterChangeHook;
/**
 * Remove sub-tenants and users of tenant before deleting the tenant.
 *
 * @param args Hook args
 * @returns {Promise<void>}
 */
var createTenantBeforeDeleteHook = function (_a) {
    var tenantCollection = _a.options.tenantCollection, config = _a.config;
    return function (_a) {
        var id = _a.id, payload = _a.req.payload;
        return __awaiter(void 0, void 0, void 0, function () {
            var children, _i, children_1, child, authCollections, _b, authCollections_2, collection, users, _c, users_2, user;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, payload.find({
                            collection: tenantCollection,
                            where: { parent: { equals: id } },
                        })];
                    case 1:
                        children = (_d.sent()).docs;
                        _i = 0, children_1 = children;
                        _d.label = 2;
                    case 2:
                        if (!(_i < children_1.length)) return [3 /*break*/, 5];
                        child = children_1[_i];
                        return [4 /*yield*/, payload.delete({
                                collection: tenantCollection,
                                id: child.id,
                            })];
                    case 3:
                        _d.sent();
                        _d.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5:
                        authCollections = config.collections.filter(function (collection) { return collection.auth; });
                        _b = 0, authCollections_2 = authCollections;
                        _d.label = 6;
                    case 6:
                        if (!(_b < authCollections_2.length)) return [3 /*break*/, 12];
                        collection = authCollections_2[_b].slug;
                        return [4 /*yield*/, payload.find({
                                collection: collection,
                                where: { tenant: { equals: id } },
                            })];
                    case 7:
                        users = (_d.sent()).docs;
                        _c = 0, users_2 = users;
                        _d.label = 8;
                    case 8:
                        if (!(_c < users_2.length)) return [3 /*break*/, 11];
                        user = users_2[_c];
                        return [4 /*yield*/, payload.delete({
                                collection: collection,
                                id: user.id,
                            })];
                    case 9:
                        _d.sent();
                        _d.label = 10;
                    case 10:
                        _c++;
                        return [3 /*break*/, 8];
                    case 11:
                        _b++;
                        return [3 /*break*/, 6];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
};
exports.createTenantBeforeDeleteHook = createTenantBeforeDeleteHook;
