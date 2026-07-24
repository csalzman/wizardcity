import express from "express";
import db from "../db/databaseconnect";
const regionsRoutes = express.Router();

// Update a cell
regionsRoutes.post("/region/", async (req: any, res: any) => {
  const { region_name, color, description, selected } = req.body;

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
  });

  // Create Region
  const stmt = await db.prepare(`
    INSERT INTO regions (region_name, color, description)
    VALUES (?, ?, ?)
    RETURNING *;
  `);
  const region = await stmt.get([region_name, color, description]);

  // Update cells
  const placeholders = selected.split(", ").map(() => "?");
  const cellUpdateStmt = await db.prepare(`
    UPDATE cells 
    SET 
      region = ?
    WHERE id IN (${placeholders}) 
    RETURNING *
    `);
  const cellsUpdated = await cellUpdateStmt.all([
    region.id,
    ...selected.split(", "),
  ]);

  console.log("cellsUpdated", typeof cellsUpdated, cellsUpdated);

  // Get cells with regions
  const getCells = await db.prepare(
    `SELECT 
      cells.id,
      cells.map_id,
      cells.x,
      cells.y,
      cells.map_link,
      cells.region,
      cells.nature,
      cells.description,
      cells.created_at,
      cells.updated_at,
      cells.deleted_at,
      regions.color,
      regions.region_name
    FROM cells 
    LEFT JOIN regions ON cells.region = regions.id  
    WHERE cells.id IN (${placeholders})`,
  );

  const cells = await getCells.all([...selected.split(", ")]);

  for (let i = 0; i < cells.length; i++) {
    const htmlSnippet: any = await new Promise((resolve, reject) => {
      res.render(
        "../crystalball/map-components/cell",
        {
          cell: cells[i],
          cellSize: 50,
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

export default regionsRoutes;
