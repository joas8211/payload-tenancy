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
exports.createResourceCreateAccess = exports.createResourceReadAccess = void 0;
var limitAccess_1 = require("../utils/limitAccess");
var defaultAccess_1 = require("../utils/defaultAccess");
/**
 * Limits resource access to resources that belong to the same tenant based on
 * user's tenant ("user" strategy) or requested tenant ("path" or "domain"
 * strategy).
 *
 * @returns Collection access control for generic resources
 */
var createResourceReadAccess = function (_a) {
    var options = _a.options, original = _a.original;
    return function (args) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, _d;
        var _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    if (!original) {
                        original = (0, defaultAccess_1.createDefaultAccess)({ options: options, payload: args.req.payload });
                    }
                    if (!["path", "domain"].includes(options.isolationStrategy)) return [3 /*break*/, 2];
                    _b = limitAccess_1.limitAccess;
                    return [4 /*yield*/, original(args)];
                case 1:
                    _a = _b.apply(void 0, [_f.sent(), {
                            tenant: {
                                equals: args.req.tenant.id,
                            },
                        }]);
                    return [3 /*break*/, 5];
                case 2:
                    _c = Boolean((_e = args.req.user) === null || _e === void 0 ? void 0 : _e.tenant);
                    if (!_c) return [3 /*break*/, 4];
                    // Limit access to users's tenant.
                    _d = limitAccess_1.limitAccess;
                    return [4 /*yield*/, original(args)];
                case 3:
                    // Limit access to users's tenant.
                    _c = _d.apply(void 0, [_f.sent(), {
                            tenant: {
                                equals: args.req.user.tenant.id || args.req.user.tenant,
                            },
                        }]);
                    _f.label = 4;
                case 4:
                    _a = _c;
                    _f.label = 5;
                case 5: return [2 /*return*/, _a];
            }
        });
    }); };
};
exports.createResourceReadAccess = createResourceReadAccess;
/**
 * Limits resource creation to users with tenant.
 *
 * @param original Original access control to take into account.
 * @returns Collection access control for generic resources
 */
var createResourceCreateAccess = function (_a) {
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
exports.createResourceCreateAccess = createResourceCreateAccess;
