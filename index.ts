import "dotenv/config";
import express from "express";

// Make sure db is setup
import seedDb from "./src/db/databasesetup";
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

// Adds headers: Access-Control-Allow-Origin: *
// TODO: probably only want this for local dev
// app.use(cors());

// Backend routes
import wizardsRoutes from "./src/spellbook/wizards";
import mapsRoutes from "./src/spellbook/maps";
import cellsRoutes from "./src/spellbook/cells";
app.use("/spellbook", wizardsRoutes);
app.use("/spellbook", mapsRoutes);
app.use("/spellbook", cellsRoutes);

// Start app
app.listen(3000, () => {
  console.log("WIZARDCITY is running on http://localhost:3000");
});

// Defining our frontend routes
// TODO: better way to do this?

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

//

app.get("/login", (req: any, res: any) => {
  res.render("login", {
    title: "Login",
  });
});
