const express = require("express");
const router = express.Router();
const db = require("../db/databaseSetup.js");

// Get all wizards
router.get("/wizards", (req, res) => {
  const stmt = db.prepare("SELECT * FROM wizards").all();

  res.json(stmt);
});

// Create a new wizard
// TODO: this will need to require a password too
router.post("/wizards", (req, res) => {
  const stmt = db.prepare(
    "INSERT INTO wizards (wizard_name, email, color) VALUES ('fooa', 'bara', 'baza')",
  );

  stmt.run();

  res.json();
});

// Get a single wizard
router.get("/wizards/:id", (req, res) => {
  const getWizard = db
    .prepare("SELECT * FROM wizards WHERE wizard_name = ?")
    .all(req.params.id);

  res.json(getWizard);
});

module.exports = router;
