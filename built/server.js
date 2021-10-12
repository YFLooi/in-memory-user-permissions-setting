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
Object.defineProperty(exports, "__esModule", { value: true });
var express_validator_1 = require("express-validator");
var express = require("express");
var bodyParser = require("body-parser");
var server = express();
var port = 5000;
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
/**
 * Sample entry:
 * {
 *    email: "yihfoo@gmail.com"
 *    permissions: [
 *      { featureName: mainPage, canAccess: false },
 *      { featureName: reportsPage, canAccess: true },
 *    ]
 * }
 */
var userPermissions = [];
// Sample call: http://localhost:5000/feature?email=xxx&featureName=yyy
server.get("/feature", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, featureName, canAccess, _i, userPermissions_1, user, _a, _b, permission;
    return __generator(this, function (_c) {
        email = req.query.email;
        featureName = req.query.featureName;
        console.log("Call made to get permissions for /feature. Queries passed in:\nemail: \"" + email + "\"\nfeatureName: \"" + featureName + "\"");
        console.log("Attempting to find user profile and associated permissions for " + email);
        canAccess = null;
        for (_i = 0, userPermissions_1 = userPermissions; _i < userPermissions_1.length; _i++) {
            user = userPermissions_1[_i];
            if (user.email == email) {
                for (_a = 0, _b = user.permissions; _a < _b.length; _a++) {
                    permission = _b[_a];
                    if (permission.featureName == featureName) {
                        canAccess = permission.canAccess;
                    }
                }
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
    });
}); });
server.post("/feature", (0, express_validator_1.body)("featureName").isString(), (0, express_validator_1.body)("email").isEmail(), (0, express_validator_1.body)("enable").isBoolean(), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, featureName, email, enable, existingEmails, i, existingPermissions, j;
    return __generator(this, function (_b) {
        _a = req.body, featureName = _a.featureName, email = _a.email, enable = _a.enable;
        console.log("Request made to set permissions for /feature with\n\n      featureName == \"" + featureName + "\"\n\n      email == \"" + email + "\"\n\n      enable == \"" + enable + "\"\n");
        existingEmails = userPermissions.map(function (user) {
            return user.email;
        });
        if (!existingEmails.includes(email)) {
            console.log("Input email is not present, create a new entry");
            userPermissions.push({
                email: email,
                permissions: [
                    {
                        featureName: featureName,
                        canAccess: enable,
                    },
                ],
            });
        }
        else {
            console.log("Input email is present, examining associated permissions");
            for (i = 0; i < userPermissions.length; ++i) {
                if (userPermissions[i].email == email) {
                    existingPermissions = userPermissions[i].permissions.map(function (user) {
                        return user.featureName;
                    });
                    if (!existingPermissions.includes(featureName)) {
                        console.log("Permission does not exist for featureName " + featureName + ". Craeting an entry for it");
                        userPermissions[i].permissions.push({
                            featureName: featureName,
                            canAccess: enable,
                        });
                    }
                    else {
                        console.log("Permission exists for featureName " + featureName + ". Updating its canAccess field");
                        for (j = 0; j < userPermissions[i].permissions.length; ++j) {
                            if (userPermissions[i].permissions[j].featureName == featureName) {
                                userPermissions[i].permissions[j].canAccess = enable;
                            }
                        }
                    }
                }
            }
        }
        return [2 /*return*/, res.status(200).json({
                message: "Successfully updated permission for " + featureName + " for " + email,
            })];
    });
}); });
server.listen(port, function () {
    console.log("Server is listening on http://localhost:" + port);
});
