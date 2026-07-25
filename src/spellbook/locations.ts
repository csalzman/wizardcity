import express from "express";
import db from "../db/databaseconnect";
const locationsRoutes = express.Router();

// Update a cell
locationsRoutes.post("/location/", async (req: any, res: any) => {
  const { location_name, color, description, selected } = req.body;

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
  });

  // Create Location
  const stmt = await db.prepare(`
    INSERT INTO locations (location_name, color, description)
    VALUES (?, ?, ?)
    RETURNING *;
  `);
  const location = await stmt.get([location_name, color, description]);

  // Update cells
  const placeholders = selected.split(", ").map(() => "?");
  const cellUpdateStmt = await db.prepare(`
    UPDATE cells 
    SET 
      location = ?
    WHERE id IN (${placeholders}) 
    RETURNING *
    `);
  const cellsUpdated = await cellUpdateStmt.all([
    location.id,
    ...selected.split(", "),
  ]);

  console.log("cellsUpdated", typeof cellsUpdated, cellsUpdated);

  // Get cells with locations
  const getCells = await db.prepare(
    `SELECT 
      cells.id,
      cells.map_id,
      cells.x,
      cells.y,
      cells.map_link,
      cells.location,
      cells.structure_image,
      cells.description,
      cells.created_at,
      cells.updated_at,
      cells.deleted_at,
      locations.color,
      locations.location_name
    FROM cells 
    LEFT JOIN locations ON cells.location = locations.id  
    WHERE cells.id IN (${placeholders})`,
  );

  const cells = await getCells.all([...selected.split(", ")]);

  for (let i = 0; i < cells.length; i++) {
    const htmlSnippet: any = await new Promise((resolve, reject) => {
      res.render(
        "../crystalball/map-components/cell",
        {
          cell: cells[i],
        },
        (err: any, html: any) => {
          if (err) reject(err);
          else resolve(html);
        },
      );
    });
    res.write(
      `event: datastar-patch-elements\ndata: elements ${htmlSnippet.replace(/\n/g, "")}\n\n`,
    );
  }

  res.end();
});

export default locationsRoutes;
