const serverless = require("@tursodatabase/serverless");

const dbClient = serverless.connect({
  url: process.env.DB_URL,
  authToken: process.env.DB_AUTH,
});

module.exports = dbClient;
