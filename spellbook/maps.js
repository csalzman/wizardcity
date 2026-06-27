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
  const stmt = "SELECT * FROM cells WHERE map = ?";

  const mapInfo = db.prepare(stmt).all(req.params.id);
  console.log(mapInfo);

  // TODO: this renders the cell.ejs file. This needs to loop through anyof the cells and fill in details about the cells
  res.render("map-components/map", { text: "cell" });

  // this also works. whatever is sent back needs to match what is being lazy loaded to get replaced
  // res.send('<div id="map">bar</div>)
});

// Create a new map
router.post("/maps", (req, res) => {
  const stmt = db.prepare("INSERT INTO maps (name) VALUES (?) RETURNING *");

  const r = stmt.run(req.body.name);

  console.log(r);
  res.json();
});

module.exports = router;
