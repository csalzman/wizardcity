import "dotenv/config";
import express, { Request, Response } from "express";
import {
  globalBroadcastBroker,
  BROADCAST_EVENT_NAME,
} from "./src/spellbook/events";

// Track all active Datastar SSE generators
const activeClients = new Set<Response>();

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

const activeCount = { current: 0 };

/**
 * 1. SSE Connection Stream
 * Datastar connects here to listen for real-time DOM changes
 */
app.get("/stream", async (req: Request, res: Response) => {
  // Set explicit SSE headers manually
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "Datastar-SSE-Reconnect": "true",
  });
  res.flushHeaders();

  activeClients.add(res);

  // 2. Define how this specific connection reacts to a broadcast
  const onGlobalBroadcast = async (htmlFragment: string) => {
    // Format exactly according to the strict Datastar specification
    const payload = `event: datastar-patch-elements\ndata: elements ${htmlFragment}\n\n`;
    res.write(payload);
  };

  // Subscribe this client connection to the central broker
  globalBroadcastBroker.on(BROADCAST_EVENT_NAME, onGlobalBroadcast);

  // 3. Clean up the listener when the user closes the window or disconnects
  req.on("close", () => {
    globalBroadcastBroker.off(BROADCAST_EVENT_NAME, onGlobalBroadcast);
    activeCount.current--;
    res.end();
  });
});

// To broadcast manually formatted chunks:
app.post("/broadcast", (req, res) => {
  const htmlFragment = `<div id="status-feed">${req.body.message}</div>`;

  // Format precisely matching the Datastar specification
  const payload = `event: datastar-patch-elements\ndata: fragments ${htmlFragment}\n\n`;

  activeClients.forEach((clientRes) => {
    clientRes.write(payload);
  });

  res.sendStatus(200);
});

// Start app
app.listen(3000, () => {
  console.log("WIZARDCITY is running on http://localhost:3000");
});
