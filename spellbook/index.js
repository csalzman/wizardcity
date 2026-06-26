const express = require("express");
const cors = require("cors");

// Make sure db is setup
require("./db/databasesetup.js");

const app = express();

// Allow for json
app.use(express.json());

// Adds headers: Access-Control-Allow-Origin: *
// TODO: probably only want this for local dev
app.use(cors());

// Routes
const wizardsRoutes = require("./routes/wizards.js");
const mapsRoutes = require("./routes/maps.js");
const cellsRoutes = require("./routes/cells.js");
app.use(wizardsRoutes);
app.use(mapsRoutes);
app.use(cellsRoutes);

// Start app
app.listen(3000, () => {
  console.log("SPELLBOOK is running on http://localhost:3000");
});
