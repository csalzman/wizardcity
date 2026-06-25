const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Define path to the SQLite database file
const dbPath = path.resolve(__dirname, "database.db");

// Connect to the SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error connecting to database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

module.exports = db;
