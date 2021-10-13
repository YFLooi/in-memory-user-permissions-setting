"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.constructMongoConnection = void 0;
var mongoCredentialsFromKeyFile = { username: "", password: "" };
try {
    mongoCredentialsFromKeyFile = require("../../keys/mongo.json");
}
catch (err) {
    console.error("could not read mongo key file");
}
// * Get Database Connection
function constructMongoConnection(dbUserName, dbPassword, dbName) {
    if (dbUserName === void 0) { dbUserName = mongoCredentialsFromKeyFile.username; }
    if (dbPassword === void 0) { dbPassword = mongoCredentialsFromKeyFile.password; }
    if (dbName === void 0) { dbName = "in-memory-user-permission-setting"; }
    return "mongodb+srv://" + dbUserName + ":" + dbPassword + "@sandbox.9xeet.mongodb.net/" + dbName + "?retryWrites=true&w=majority";
}
exports.constructMongoConnection = constructMongoConnection;
// module.exports = { constructMongoConnection };
