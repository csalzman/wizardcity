const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const DB_PATH = path.join(__dirname, "database.db");
const SCHEMA_PATH = path.join(__dirname, "schema.sql");

// Check if the database file already exists
const dbExists = fs.existsSync(DB_PATH);

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) return console.error(err.message);

  // Only run the script if it's a freshly created database
  if (!dbExists) {
    const sql = fs.readFileSync(SCHEMA_PATH, "utf8");
    db.exec(sql, (err) => {
      if (err) console.error("Initialization error:", err.message);
      else console.log("Database created and initialized.");
    });
  } else {
    console.log(
      "Database file already exists. Skipping initialization script.",
    );
  }
});
