const express = require("express");
const cors = require("cors");

// Make sure db is setup
require("./db/databasesetup.js");

const app = express();

// Allow for serving static files without html at the end
const staticOptions = {
  extensions: ["html"],
};

app.use(express.static("crystalball", staticOptions));

// Allow for json
app.use(express.json());

// Adds headers: Access-Control-Allow-Origin: *
// TODO: probably only want this for local dev
// app.use(cors());

// Routes
const wizardsRoutes = require("./spellbook/wizards.js");
const mapsRoutes = require("./spellbook/maps.js");
const cellsRoutes = require("./spellbook/cells.js");
app.use("/spellbook", wizardsRoutes);
app.use("/spellbook", mapsRoutes);
app.use("/spellbook", cellsRoutes);

// Start app
app.listen(3000, () => {
  console.log("SPELLBOOK is running on http://localhost:3000");
});
