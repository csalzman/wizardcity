const fs = require("fs");
const path = require("path");

const Database = require("libsql");

import schema from "./initialSchema";

const url = process.env.DB_URL;
const authToken = process.env.DB_AUTH;

const opts = {
  authToken: authToken,
};

function seedDb() {
  const db = new Database(url, opts);

  // Run through inital schema
  db.exec(schema);
}

export default seedDb;
