const express = require("express");
const router = express.Router();
const db = require("../db/databasesetup.js");

router.get("/wizards", (req, res) => {
  const stmt = db.prepare("SELECT * FROM wizards");

  const returned = stmt.run();

  res.json(returned);
});

router.post("/wizards", (req, res) => {
  const sql = "INSERT INTO wizards";

  const stmt = db.prepare(
    "INSERT INTO wizards (wizard_name, email, color) VALUES ('fooa', 'bara', 'baza')",
  );

  stmt.run();

  res.json();
});

router.get("/wizards/:id", (req, res) => {
  res.send({
    wizard: [
      {
        name: req.params.id,
      },
    ],
  });
});

module.exports = router;
