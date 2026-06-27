require("dotenv").config();
const express = require("express");

// Make sure db is setup
require("./db/databasesetup.js");

const app = express();

// TODO: not sure we need this anymore
// Allow for serving static files without html at the end
const staticOptions = {
  extensions: ["html"],
};
app.use(express.static("./crystalball", staticOptions));

app.set("views", "./crystalball");
app.set("view engine", "ejs");

// Allow for json
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

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
  console.log("WIZARDCITY is running on http://localhost:3000");
});

// Defining our static routes
// TODO: better way to do this?
app.get("/", (req, res) => {
  res.render("index", {
    title: "Wizard City",
  });
});

app.get("/maps", (req, res) => {
  res.render("maps", {
    title: "Maps",
  });
});

app.get("/terraform", (req, res) => {
  res.render("terraform", {
    title: "Terraform",
  });
});

app.get("/wizards", (req, res) => {
  res.render("wizards", {
    title: "Wizards",
  });
});

app.get("/login", (req, res) => {
  res.render("login", {
    title: "Login",
  });
});
