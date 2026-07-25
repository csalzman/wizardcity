import "dotenv/config";
import express from "express";

// Make sure db is setup
import seedDb from "./db/databasesetup";

// Seed everytime, will mostly be a no-op
seedDb();

const app = express();

const staticOptions = {
  extensions: ["html"],
};

// Public assets only
app.use(express.static("./src/public", staticOptions));

app.set("views", "./src/crystalball");
app.set("view engine", "ejs");

// Allow for json
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Auth middleware
import cookieParser from "cookie-parser";
app.use(cookieParser());

import { attachUser, requireLogin } from "./tim/middleware";
app.use(attachUser);

// What is your favorite color?
import timRoutes from "./tim/discord";
app.use("/auth", timRoutes);

// Everything below this line requires being logged in
// If not the user is redirected to the login page
app.use(requireLogin);

// Spellbook/Backend routes
import wizardsRoutes from "./spellbook/wizards";
import mapsRoutes from "./spellbook/maps";
import cellsRoutes from "./spellbook/cells";
import locationsRoutes from "./spellbook/locations";
import structuresRoutes from "./spellbook/structure";
app.use("/spellbook", wizardsRoutes);
app.use("/spellbook", mapsRoutes);
app.use("/spellbook", cellsRoutes);
app.use("/spellbook", locationsRoutes);
app.use("/spellbook", structuresRoutes);

// Defining our frontend routes
// Homepage
app.get("/", (req: any, res: any) => {
  res.render("index", {
    title: "Wizard City",
  });
});

// Map related
// Show list of all maps
app.get("/maps", (req: any, res: any) => {
  res.render("maps", {
    title: "Maps",
  });
});

// Show map
app.get("/map/:map_name", (req: any, res: any) => {
  res.render("map", {
    title: req.params.map_name,
  });
});

//Generate new map
app.get("/terraform", (req: any, res: any) => {
  res.render("terraform", {
    title: "Terraform",
  });
});

// List of wizards
app.get("/wizards", (req: any, res: any) => {
  res.render("wizards", {
    title: "Wizards",
  });
});

// Individual wizard
app.get("/wizards/:wizard_name", (req: any, res: any) => {
  res.render("wizard", {
    title: req.params.wizard_name,
  });
});

// Start app
app.listen(3000, () => {
  console.log("WIZARDCITY is running on http://localhost:3000");
});
