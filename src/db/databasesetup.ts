const fs = require("fs");
const path = require("path");

const Database = require("libsql");

const SCHEMA_PATH = path.join(__dirname, "initialSchema.sql");

const url = process.env.DB_URL;
const authToken = process.env.DB_AUTH;

const opts = {
  authToken: authToken,
};

function seedDb() {
  const db = new Database(url, opts);

  // Run through inital schema
  // TODO: possibly move this initial setup to a totally different codepath. It's fine here for now.
  const sql = fs.readFileSync(SCHEMA_PATH, "utf8");
  db.exec(sql);
}

export default seedDb;
