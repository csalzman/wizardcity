const express = require("express");
const router = express.Router();
const db = require("../db/databasesetup.js");

// Create cells. Should only be used to generate map initially
router.post("/cells", (req, res) => {
  const { height, width, map } = req.body;

  // TODO: any additional flags here?
  const stmt = db.prepare("INSERT INTO cells (map, x, y) VALUES (?, ?, ?)");

  // TODO: loop through height and width to create cells
  for (let h = 0; h <= height; h++) {
    for (let w = 0; w <= width; w++) {
      stmt.run(req.body.map, h, w);
    }
  }

  res.json();
});

module.exports = router;
