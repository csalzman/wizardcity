import express from "express";
import db from "../db/databaseconnect";
const mapsRoutes = express.Router();

// Get all maps
mapsRoutes.get("/maps/", async (req: any, res: any) => {
  const stmt = await db.prepare("SELECT * FROM maps");
  const maps = await stmt.all();

  res.json(maps);
});

// Get map information
mapsRoutes.get("/maps/:id", async (req: any, res: any) => {
  const stmt = await db.prepare("SELECT * FROM cells WHERE map = ?");

  const map = await stmt.all(req.params.id);
  console.log(map);

  // TODO: this renders the cell.ejs file. This needs to loop through anyof the cells and fill in details about the cells
  res.render("map-components/map", { text: "cell" });

  // this also works. whatever is sent back needs to match what is being lazy loaded to get replaced
  // res.send('<div id="map">bar</div>)
});

// Create a new map
mapsRoutes.post("/create-map", async (req: any, res: any) => {
  // Create map
  let inserted;
  try {
    const mapStmt = await db.prepare(
      "INSERT INTO maps (name) VALUES (?) RETURNING *",
    );
    inserted = await mapStmt.get([req.body.name]);
  } catch {
    res.send(`<div id='terraform-output'>Error with map creation</div>`);
  }

  // TODO: catch any errors here like if the name is already taken

  // Generate cells
  const mapId = inserted?.id;

  const cellStmt = "INSERT INTO cells (map, x, y) VALUES (?, ?, ?)";

  const mapSize = 10;

  const arr = [];

  for (let i = 0; i < mapSize; i++) {
    for (let j = 0; j < mapSize; j++) {
      arr.push({ sql: cellStmt, args: [mapId, i, j] });
    }
  }

  await db.batch(arr);

  const getCellsStmt = await db.prepare("SELECT * FROM cells WHERE map = ?");

  const cells = await getCellsStmt.all(mapId);

  // TODO: replace with something else like a button to go to the map
  console.log(cells);

  res.send(`<div id='terraform-output'>Map created: ${inserted?.name}</div>`);
});

export default mapsRoutes;
