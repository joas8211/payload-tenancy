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
exports.createUserCreateAccess = exports.createUserReadAccess = void 0;
var defaultAccess_1 = require("../utils/defaultAccess");
var getAuthorizedTenants_1 = require("../utils/getAuthorizedTenants");
var limitAccess_1 = require("../utils/limitAccess");
/**
 * Limits user access to users that belong to the same or above tenant.
 *
 * @returns Collection access control for users
 */
var createUserReadAccess = function (_a) {
    var options = _a.options, 
    /** Original access control to take into account. */
    original = _a.original;
    return function (args) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f, _g;
        var _h, _j, _k, _l, _m;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0:
                    if (!original) {
                        original = (0, defaultAccess_1.createDefaultAccess)({ options: options, payload: args.req.payload });
                    }
                    if (!["path", "domain"].includes(options.isolationStrategy)) return [3 /*break*/, 3];
                    _b = limitAccess_1.limitAccess;
                    return [4 /*yield*/, original(args)];
                case 1:
                    _c = [_o.sent()];
                    _h = {};
                    _j = {};
                    _k = {};
                    return [4 /*yield*/, (0, getAuthorizedTenants_1.getAuthorizedTenants)({
                            options: options,
                            payload: args.req.payload,
                            tenantId: args.req.tenant.id,
                        })];
                case 2:
                    _a = _b.apply(void 0, _c.concat([(_h.or = [
                            (_j.tenant = (_k.in = _o.sent(),
                                _k),
                                _j),
                            // Current user must be always accessible.
                            {
                                id: {
                                    equals: args.req.user.id,
                                },
                            }
                        ],
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
                    _g = [_o.sent()];
                    _l = {};
                    _m = {};
                    return [4 /*yield*/, (0, getAuthorizedTenants_1.getAuthorizedTenants)({
                            options: options,
                            payload: args.req.payload,
                            tenantId: args.req.user.tenant.id || args.req.user.tenant,
                        })];
                case 5:
                    // Limit access to users's tenant or its sub-tenants.
                    _e = _f.apply(void 0, _g.concat([(_l.tenant = (_m.in = _o.sent(),
                            _m),
                            _l)]));
                    _o.label = 6;
                case 6:
                    // Initial user doesn't have an assigned tenant during installation
                    // process, and must be allowed to access it's own profile.
                    _d = (_e);
                    _o.label = 7;
                case 7:
                    _a = _d;
                    _o.label = 8;
                case 8: return [2 /*return*/, _a];
            }
        });
    }); };
};
exports.createUserReadAccess = createUserReadAccess;
/**
 * Limits user creation to users with tenant.
 *
 * @param original Original access control to take into account.
 * @returns Collection access control for users
 */
var createUserCreateAccess = function (_a) {
    var options = _a.options, original = _a.original;
    return function (args) {
        var _a;
        if (!original) {
            original = (0, defaultAccess_1.createDefaultAccess)({ options: options, payload: args.req.payload });
        }
        return ["path", "domain"].includes(options.isolationStrategy)
            ? original(args)
            : // User must be logged in and have assigned tenant.
                Boolean((_a = args.req.user) === null || _a === void 0 ? void 0 : _a.tenant) && original(args);
    };
};
exports.createUserCreateAccess = createUserCreateAccess;
