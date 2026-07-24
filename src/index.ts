import "dotenv/config";
import express, { Request, Response } from "express";

// Make sure db is setup
import seedDb from "./db/databasesetup";

// Seed everytime, will mostly be a no-op
seedDb();

const app = express();

// TODO: not sure we need this anymore
// Allow for serving static files without html at the end
const staticOptions = {
  extensions: ["html"],
};
app.use(express.static("./src/crystalball", staticOptions));

app.set("views", "./src/crystalball");
app.set("view engine", "ejs");

// Allow for json
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Spellbook/Backend routes
import wizardsRoutes from "./spellbook/wizards";
import mapsRoutes from "./spellbook/maps";
import cellsRoutes from "./spellbook/cells";
import regionsRoutes from "./spellbook/regions";
app.use("/spellbook", wizardsRoutes);
app.use("/spellbook", mapsRoutes);
app.use("/spellbook", cellsRoutes);
app.use("/spellbook", regionsRoutes);

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
