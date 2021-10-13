let mongoCredentialsFromKeyFile = { username: "", password: "" };
try {
  mongoCredentialsFromKeyFile = require("../../keys/mongo.json");
} catch (err) {
  console.error("could not read mongo key file");
}

// * Get Database Connection
export function constructMongoConnection(
  dbUserName = mongoCredentialsFromKeyFile.username,
  dbPassword = mongoCredentialsFromKeyFile.password,
  dbName = "in-memory-user-permission-setting"
) {
  return `mongodb+srv://${dbUserName}:${dbPassword}@sandbox.9xeet.mongodb.net/${dbName}?retryWrites=true&w=majority`;
}
