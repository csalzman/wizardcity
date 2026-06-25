const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "database.db");
const SCHEMA_PATH = path.join(__dirname, "schema.sql");

const db = require("better-sqlite3")(DB_PATH, { verbose: console.log });
db.pragma("journal_mode = WAL");

// Run through inital schema
// TODO: possibly move this initial setup to a totally different codepath
const sql = fs.readFileSync(SCHEMA_PATH, "utf8");
db.exec(sql);

module.exports = db;
