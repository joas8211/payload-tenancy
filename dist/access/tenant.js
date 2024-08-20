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
exports.createTenantDeleteAccess = exports.createTenantReadAccess = void 0;
var getAuthorizedTenants_1 = require("../utils/getAuthorizedTenants");
var limitAccess_1 = require("../utils/limitAccess");
var defaultAccess_1 = require("../utils/defaultAccess");
/**
 * Limits tenant access to users that belong to the same or above tenant.
 *
 * @returns Collection access control for tenants
 */
var createTenantReadAccess = function (_a) {
    var options = _a.options, original = _a.original;
    return function (args) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f, _g;
        var _h, _j, _k, _l;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0:
                    if (!original) {
                        original = (0, defaultAccess_1.createDefaultAccess)({ options: options, payload: args.req.payload });
                    }
                    if (!["path", "domain"].includes(options.isolationStrategy)) return [3 /*break*/, 3];
                    _b = limitAccess_1.limitAccess;
                    return [4 /*yield*/, original(args)];
                case 1:
                    _c = [_m.sent()];
                    _h = {};
                    _j = {};
                    return [4 /*yield*/, (0, getAuthorizedTenants_1.getAuthorizedTenants)({
                            options: options,
                            payload: args.req.payload,
                            tenantId: args.req.tenant.id,
                        })];
                case 2:
                    _a = _b.apply(void 0, _c.concat([(_h.id = (_j.in = _m.sent(),
                            _j),
                            _h)]));
                    return [3 /*break*/, 8];
                case 3:
                    _d = Boolean(args.req.user);
                    if (!_d) return [3 /*break*/, 7];
                    _e = !args.req.user.tenant;
                    if (_e) return [3 /*break*/, 6];
                    // Limit access to users's tenant or its sub-tenants.
                    _f = limitAccess_1.limitAccess;
                    return [4 /*yield*/, original(args)];
                case 4:
                    _g = [_m.sent()];
                    _k = {};
                    _l = {};
                    return [4 /*yield*/, (0, getAuthorizedTenants_1.getAuthorizedTenants)({
                            options: options,
                            payload: args.req.payload,
                            tenantId: args.req.user.tenant.id || args.req.user.tenant,
                        })];
                case 5:
                    // Limit access to users's tenant or its sub-tenants.
                    _e = _f.apply(void 0, _g.concat([(_k.id = (_l.in = _m.sent(),
                            _l),
                            _k)]));
                    _m.label = 6;
                case 6:
                    // Initial user doesn't have an assigned tenant during installation
                    // process, so it's allowed to access tenants to create one.
                    _d = (_e);
                    _m.label = 7;
                case 7:
                    _a = _d;
                    _m.label = 8;
                case 8: return [2 /*return*/, _a];
            }
        });
    }); };
};
exports.createTenantReadAccess = createTenantReadAccess;
/**
 * Limits deletion of current tenant or above tenants.
 *
 * @param original Original access control to take into account.
 * @returns Collection access control for tenants
 */
var createTenantDeleteAccess = function (_a) {
    var options = _a.options, original = _a.original;
    return function (args) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f;
        var _g, _h, _j, _k;
        var _l;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0:
                    if (!original) {
                        original = (0, defaultAccess_1.createDefaultAccess)({ options: options, payload: args.req.payload });
                    }
                    // User must be logged in and have assigned tenant.
                    _a = Boolean((_l = args.req.user) === null || _l === void 0 ? void 0 : _l.tenant);
                    if (!_a) 
                    // User must be logged in and have assigned tenant.
                    return [3 /*break*/, 7];
                    if (!["path", "domain"].includes(options.isolationStrategy)) return [3 /*break*/, 3];
                    _c = limitAccess_1.limitAccess;
                    return [4 /*yield*/, original(args)];
                case 1:
                    _d = [_m.sent()];
                    _g = {};
                    _h = {};
                    return [4 /*yield*/, (0, getAuthorizedTenants_1.getAuthorizedTenants)({
                            options: options,
                            payload: args.req.payload,
                            tenantId: args.req.tenant.id,
                        })];
                case 2:
                    _b = _c.apply(void 0, _d.concat([(_g.parent = (_h.in = _m.sent(),
                            _h),
                            _g)]));
                    return [3 /*break*/, 6];
                case 3:
                    _e = limitAccess_1.limitAccess;
                    return [4 /*yield*/, original(args)];
                case 4:
                    _f = [_m.sent()];
                    _j = {};
                    _k = {};
                    return [4 /*yield*/, (0, getAuthorizedTenants_1.getAuthorizedTenants)({
                            options: options,
                            payload: args.req.payload,
                            tenantId: args.req.user.tenant.id || args.req.user.tenant,
                        })];
                case 5:
                    _b = _e.apply(void 0, _f.concat([(_j.parent = (_k.in = _m.sent(),
                            _k),
                            _j)]));
                    _m.label = 6;
                case 6:
                    _a = (_b);
                    _m.label = 7;
                case 7: return [2 /*return*/, (_a)];
            }
        });
    }); };
};
exports.createTenantDeleteAccess = createTenantDeleteAccess;
