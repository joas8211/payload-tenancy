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
exports.createGlobalAfterChangeHook = exports.createGlobalBeforeChangeHook = exports.createGlobalBeforeReadHook = void 0;
var createGlobalBeforeReadHook = function (_a) {
    var options = _a.options, config = _a.config, global = _a.global;
    return function (_a) {
        var req = _a.req;
        return __awaiter(void 0, void 0, void 0, function () {
            var doc;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, getGlobal({
                            options: options,
                            config: config,
                            global: global,
                            req: req,
                        })];
                    case 1:
                        doc = _b.sent();
                        if (!!doc) return [3 /*break*/, 3];
                        return [4 /*yield*/, initGlobal({ options: options, config: config, global: global, req: req })];
                    case 2:
                        doc = _b.sent();
                        _b.label = 3;
                    case 3: return [2 /*return*/, doc];
                }
            });
        });
    };
};
exports.createGlobalBeforeReadHook = createGlobalBeforeReadHook;
var createGlobalBeforeChangeHook = function (_a) {
    var options = _a.options, config = _a.config, global = _a.global;
    return function (_a) {
        var data = _a.data, req = _a.req;
        return __awaiter(void 0, void 0, void 0, function () {
            var doc;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, getGlobal({
                            options: options,
                            config: config,
                            global: global,
                            req: req,
                        })];
                    case 1:
                        doc = _b.sent();
                        if (!!doc) return [3 /*break*/, 3];
                        return [4 /*yield*/, initGlobal({ options: options, config: config, global: global, req: req, data: data })];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, updateGlobal({ options: options, config: config, global: global, req: req, data: data })];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5: return [2 /*return*/, {}];
                }
            });
        });
    };
};
exports.createGlobalBeforeChangeHook = createGlobalBeforeChangeHook;
var createGlobalAfterChangeHook = function (_a) {
    var options = _a.options, config = _a.config, global = _a.global;
    return function (_a) {
        var req = _a.req;
        return getGlobal({
            options: options,
            config: config,
            global: global,
            req: req,
        });
    };
};
exports.createGlobalAfterChangeHook = createGlobalAfterChangeHook;
var extractTenantId = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h;
    var req = _a.req;
    var tenantId = (_g = (_d = (_c = (_b = req.tenant) === null || _b === void 0 ? void 0 : _b.id) !== null && _c !== void 0 ? _c : req.tenant) !== null && _d !== void 0 ? _d : (_f = (_e = req.user) === null || _e === void 0 ? void 0 : _e.tenant) === null || _f === void 0 ? void 0 : _f.id) !== null && _g !== void 0 ? _g : (_h = req.user) === null || _h === void 0 ? void 0 : _h.tenant;
    if (!tenantId) {
        throw new Error("Could not determine tenant." +
            " You can select tenant by setting it in user object when using Local API.");
    }
    return tenantId;
};
var initGlobal = function (_a) {
    var options = _a.options, global = _a.global, req = _a.req, data = _a.data;
    return req.payload.create({
        req: req,
        collection: global.slug + "Globals",
        data: __assign(__assign({}, (data !== null && data !== void 0 ? data : {})), { tenant: extractTenantId({ options: options, req: req }) }),
    });
};
var updateGlobal = function (_a) {
    var options = _a.options, global = _a.global, req = _a.req, data = _a.data;
    return req.payload.update({
        req: req,
        collection: global.slug + "Globals",
        where: {
            tenant: {
                equals: extractTenantId({ options: options, req: req }),
            },
        },
        data: __assign(__assign({}, (data !== null && data !== void 0 ? data : {})), { tenant: extractTenantId({ options: options, req: req }) }),
    });
};
var getGlobal = function (_a) {
    var options = _a.options, global = _a.global, req = _a.req;
    return __awaiter(void 0, void 0, void 0, function () {
        var globalCollection, tenantId, draft, isPublished, doc, latestPublishedVersion;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    globalCollection = global.slug + "Globals";
                    tenantId = extractTenantId({ options: options, req: req });
                    draft = (req.payloadAPI === "GraphQL" ? req.body.variables : req.query).draft;
                    isPublished = ["1", "true"].includes(draft.toString());
                    return [4 /*yield*/, req.payload.find({
                            req: req,
                            collection: globalCollection,
                            where: {
                                tenant: {
                                    equals: tenantId,
                                },
                            },
                            depth: 0,
                            limit: 1,
                        })];
                case 1:
                    doc = (_b.sent()).docs[0];
                    if (!(!isPublished && (doc === null || doc === void 0 ? void 0 : doc._status) === "draft")) return [3 /*break*/, 3];
                    return [4 /*yield*/, req.payload.findVersions({
                            req: req,
                            collection: globalCollection,
                            where: {
                                "version.tenant": {
                                    equals: tenantId,
                                },
                                "version._status": {
                                    equals: "published",
                                },
                            },
                            depth: 0,
                            limit: 1,
                            sort: "-createdAt",
                        })];
                case 2:
                    latestPublishedVersion = (_b.sent()).docs[0];
                    return [2 /*return*/, latestPublishedVersion === null || latestPublishedVersion === void 0 ? void 0 : latestPublishedVersion.version];
                case 3: return [2 /*return*/, doc];
            }
        });
    });
};
