const express = require("express");
const router = express.Router();
const db = require("../db/connect.js");

router.get("/wizards", (req, res) => {
  const sql = "SELECT * FROM wizards";

  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
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
