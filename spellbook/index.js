// Make sure db is setup
require("./db/databasesetup.js");

const express = require("express");
const app = express();
app.use(express.json());

const wizardsRoutes = require("./routes/wizards.js");
const mapsRoutes = require("./routes/maps.js");
app.use(wizardsRoutes);
app.use(mapsRoutes);

app.listen(3000, () => {
  console.log("SPELLBOOK is running on http://localhost:3000");
});
