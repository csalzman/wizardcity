import express from "express";
import db from "../db/databaseconnect";
import { cellsForMapWithEverythingStmt } from "./statements";

const mapsRoutes = express.Router();

// Get all maps
mapsRoutes.get("/list-maps/", async (req: any, res: any) => {
  const stmt = await db.prepare("SELECT * FROM maps");
  const maps = await stmt.all();

  res.render("map-components/map-list", { maps: maps });
});

// Get map information
mapsRoutes.get("/maps/:id", async (req: any, res: any) => {
  // Get map
  const mapName = req.params.id;
  const getMapStmt = await db.prepare("SELECT * FROM maps WHERE name = ?");
  const map = await getMapStmt.get(mapName);

  // If no map found return early
  if (!map) {
    res.write(
      `event: datastar-patch-elements\ndata: elements <div id="map">Map Not Found</map>\n\n`,
    );
    return res.end();
  }

  // Get map cells
  const cellWithLocationStmt = await db.prepare(cellsForMapWithEverythingStmt);
  const cellswithLocations = await cellWithLocationStmt.all(map?.id);

  // TODO: this renders the cell.ejs file. This needs to loop through anyof the cells and fill in details about the cells
  res.render("map-components/map", { cells: cellswithLocations });
});

// Get map information
mapsRoutes.get("/map-columns/:id", async (req: any, res: any) => {
  // Get map
  const mapName = req.params.id;
  const getMapStmt = await db.prepare(
    "SELECT x_size, y_size FROM maps WHERE name = ?",
  );
  const map = await getMapStmt.get(mapName);

  // If no map found return early
  if (!map) {
    res.write(
      `event: datastar-patch-elements\ndata: elements <div id="map">Map Not Found</map>\n\n`,
    );
    return res.end();
  }

  res.json({ x_size: map.x_size, y_size: map.y_size });
});

// Create a new map
mapsRoutes.post("/create-map", async (req: any, res: any) => {
  const { map_name, map_size } = req.body;

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
  });

  res.write(
    `event: datastar-patch-signals\ndata: signals {terraformOutput: "creating" }\n\n`,
  );

  if (map_size > 100 || map_size <= 0) {
    res.write(
      `event: datastar-patch-signals\ndata: signals {terraformOutput: "Map Size out of bounds!" }\n\n`,
    );
    res.end();
  }

  // Create map
  let inserted: any;
  try {
    const mapStmt = await db.prepare(
      "INSERT INTO maps (name, x_size, y_size) VALUES (?, ?, ?) RETURNING *",
    );
    inserted = await mapStmt.get([map_name, map_size, map_size]);
  } catch {
    res.write(
      `event: datastar-patch-signals\ndata: signals {terraformOutput: "Name already taken" }\n\n`,
    );

    return res.end();
  }
  res.write(
    `event: datastar-patch-signals\ndata: signals {terraformOutput: "Map made, generating cells" }\n\n`,
  );

  // Generate cells
  const mapId = inserted?.id;
  const cellStmt = "INSERT INTO cells (map_id, x, y) VALUES";
  const mapSize = map_size;
  const arr = [];

  let insertString = cellStmt;

  try {
    // Build sql and array of values
    for (let i = 0; i < mapSize; i++) {
      for (let j = 0; j < mapSize; j++) {
        insertString += "(?, ?, ?) ,";
        arr.push(...[mapId, i, j]);
      }
    }

    // Remove last comma
    insertString = insertString.slice(0, -1);

    // Execute insert
    const insertStmt = await db.prepare(insertString);
    await insertStmt.all(arr);
  } catch (e) {
    console.log(e);
    res.write(
      `event: datastar-patch-signals\ndata: signals {terraformOutput: "Error generating cells" }\n\n`,
    );
    return res.end();
  }

  res.write(
    `event: datastar-patch-signals\ndata: signals {terraformOutput: "Map created! Cells generated!" }\n\n`,
  );

  return res.end();
});

export default mapsRoutes;
