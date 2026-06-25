const express = require("express");
const router = express.Router();
const db = require("../db/databasesetup.js");

// Get all maps
router.get("/maps/", (req, res) => {
  const stmt = db.prepare("SELECT * FROM maps").all();

  res.json(stmt);
});

// Get map information
router.get("/maps/:id", (req, res) => {
  const stmt = db
    .prepare("SELECT * FROM cells WHERE map = ?")
    .all(req.params.id);

  res.json(stmt);
});

// Create a new map
router.post("/maps", (req, res) => {
  const stmt = db.prepare("INSERT INTO maps (name) VALUES (?)");

  stmt.run(req.body.name);

  res.json();
});

module.exports = router;
