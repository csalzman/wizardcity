const express = require("express");
const router = express.Router();
const db = require("../db/databasesetup.js");

// Get all wizards
router.get("/wizards", async (req, res) => {
  const stmt = await db.prepare("SELECT * FROM wizards").all();

  res.json(stmt);
});

// Create a new wizard
// TODO: this will need to require a password too
router.post("/wizards", async (req, res) => {
  const stmt = await db.prepare(
    "INSERT INTO wizards (wizard_name, email, color) VALUES ('fooa', 'bara', 'baza')",
  );

  const wizard = await stmt.get();
  console.log(wizard);

  res.send(`<div id='wizard'>Wizard created: ${inserted.wizard_name}</div>`);
});

// Get a single wizard
router.get("/wizards/:wizard_name", async (req, res) => {
  const stmt = await db.prepare("SELECT * FROM wizards WHERE wizard_name = ?");

  const wizard = await stmt.get(req.params.wizard_name);

  console.log(wizard);

  res.json(wizard);
});

module.exports = router;
