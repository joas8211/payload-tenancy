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
exports.createUserTenantField = void 0;
var getAuthorizedTenants_1 = require("../utils/getAuthorizedTenants");
var mergeObjects_1 = require("../utils/mergeObjects");
var createValidate = function (options) {
    return function (value, _a) {
        var payload = _a.payload, user = _a.user;
        return __awaiter(void 0, void 0, void 0, function () {
            var authorizedTenants;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // Don't validate initial user creation and such.
                        if (!user)
                            return [2 /*return*/, true];
                        // Otherwise than in the above condition, tenant must have a value.
                        if (!value) {
                            return [2 /*return*/, "Required"];
                        }
                        // Skip the following validations on front-end.
                        if (!payload)
                            return [2 /*return*/, true];
                        // Skip the following validations when user does not have tenant yet.
                        if (!user.tenant)
                            return [2 /*return*/, true];
                        return [4 /*yield*/, (0, getAuthorizedTenants_1.getAuthorizedTenants)({
                                options: options,
                                payload: payload,
                                tenantId: user.tenant.id || user.tenant,
                            })];
                    case 1:
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
/** @returns Tenant field for users. */
var createUserTenantField = function (_a) {
    var options = _a.options, collection = _a.collection;
    return (0, mergeObjects_1.mergeObjects)({
        type: "relationship",
        name: "tenant",
        relationTo: options.tenantCollection,
        required: true,
        validate: createValidate(options),
        admin: {
            condition: function () { var _a; return !((_a = globalThis.location) === null || _a === void 0 ? void 0 : _a.pathname.endsWith("/create-first-user")); },
        },
    }, collection.fields.find(function (field) { return "name" in field && field.name === "tenant"; }));
};
exports.createUserTenantField = createUserTenantField;
