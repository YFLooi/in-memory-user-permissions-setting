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
        while (_) try {
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_validator_1 = require("express-validator");
var mongoose_1 = __importDefault(require("mongoose"));
var server_config_1 = require("./src/server.config");
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var user_permissions_model_1 = __importDefault(require("./src/user-permissions.model"));
var lodash_1 = __importDefault(require("lodash"));
var server = (0, express_1.default)();
var port = 5000;
server.use(body_parser_1.default.json());
server.use(body_parser_1.default.urlencoded({ extended: true }));
// const CompaniesModel = require("./companiesSchema");
// const constructMongoConnection = require("./backend/config/server.config.js");
// Connecting to database
var mongoConnectionString = (0, server_config_1.constructMongoConnection)();
mongoose_1.default.Promise = global.Promise;
mongoose_1.default.connect(mongoConnectionString, {}, function (error) {
    if (error) {
        console.log("Error!" + error);
    }
    else {
        console.log("Connected to MongoDB Atlas database");
    }
});
/**
 * Sample document in db:
 * {
 *    email: "yihfoo@gmail.com"
 *    permissions: [
 *      { featureName: mainPage, canAccess: false },
 *      { featureName: reportsPage, canAccess: true },
 *    ]
 * }
 */
// Sample call: http://localhost:5000/feature?email=xxx&featureName=yyy
server.get("/feature", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var queryParam, email, featureName, userProfile, userPermissions, canAccess, _i, userPermissions_1, permission;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                queryParam = req.query;
                email = queryParam.email;
                featureName = queryParam.featureName;
                console.log("Call made to get permissions for /feature. Queries passed in:\nemail: \"" + email + "\"\nfeatureName: \"" + featureName + "\"");
                console.log("Attempting to find user profile and associated permissions for " + email);
                return [4 /*yield*/, user_permissions_model_1.default.findOne({
                        email: email,
                    })];
            case 1:
                userProfile = _a.sent();
                userPermissions = lodash_1.default.isEmpty(userProfile === null || userProfile === void 0 ? void 0 : userProfile.permissions)
                    ? []
                    : userProfile.permissions;
                canAccess = null;
                for (_i = 0, userPermissions_1 = userPermissions; _i < userPermissions_1.length; _i++) {
                    permission = userPermissions_1[_i];
                    if (permission.featureName == featureName) {
                        canAccess = permission.canAccess;
                    }
                }
                if (canAccess !== null) {
                    res.status(200).json({ canAccess: canAccess });
                }
                else {
                    res
                        .status(400)
                        .json({ message: "Access permission not found for email \"" + email + "\"" });
                }
                return [2 /*return*/];
        }
    });
}); });
server.post("/feature", (0, express_validator_1.body)("featureName").isString(), (0, express_validator_1.body)("email").isEmail(), (0, express_validator_1.body)("enable").isBoolean(), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, featureName, email, enable, existingUserProfile, userProfile, existingUserPermissions, i, updatedUserProfile, updatedUserProfile;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, featureName = _a.featureName, email = _a.email, enable = _a.enable;
                console.log("Request made to set permissions for /feature with\n\n      featureName == \"" + featureName + "\"\n\n      email == \"" + email + "\"\n\n      enable == \"" + enable + "\"\n");
                return [4 /*yield*/, user_permissions_model_1.default.findOne({
                        email: email,
                    })];
            case 1:
                existingUserProfile = _b.sent();
                if (!lodash_1.default.isEmpty(existingUserProfile)) return [3 /*break*/, 3];
                console.log("UserProfile for input email " + email + " is not present, create a new userProfile");
                return [4 /*yield*/, user_permissions_model_1.default.create({
                        email: email,
                        permissions: [
                            {
                                featureName: featureName,
                                canAccess: enable,
                            },
                        ],
                    })];
            case 2:
                userProfile = _b.sent();
                return [3 /*break*/, 9];
            case 3:
                console.log("userProfile for input email is present, examining associated permissions");
                existingUserPermissions = existingUserProfile.permissions.map(function (permission) { return permission.featureName; });
                console.log("existingUserPermissions: " + JSON.stringify(existingUserPermissions, null, 2));
                i = 0;
                _b.label = 4;
            case 4:
                if (!(i < existingUserPermissions.length)) return [3 /*break*/, 9];
                if (!!existingUserPermissions.includes(featureName)) return [3 /*break*/, 6];
                console.log("Permission does not exist for featureName " + featureName + ". Creating an entry for it");
                return [4 /*yield*/, user_permissions_model_1.default.updateOne({
                        email: email,
                    }, {
                        $addToSet: {
                            permissions: {
                                featureName: featureName,
                                canAccess: enable,
                            },
                        },
                    })];
            case 5:
                updatedUserProfile = _b.sent();
                return [3 /*break*/, 8];
            case 6:
                console.log("Permission exists for featureName " + featureName + ". Updating its canAccess field");
                return [4 /*yield*/, user_permissions_model_1.default.updateOne({
                        email: email,
                        "permissions.featureName": featureName,
                    }, {
                        $set: {
                            "permissions.$.canAccess": enable,
                        },
                    })];
            case 7:
                updatedUserProfile = _b.sent();
                _b.label = 8;
            case 8:
                ++i;
                return [3 /*break*/, 4];
            case 9: return [2 /*return*/, res.status(200).json({
                    message: "Successfully updated permission for \"" + featureName + "\" for \"" + email + "\"",
                })];
        }
    });
}); });
server.listen(port, function () {
    console.log("Server is listening on http://localhost:" + port);
});
