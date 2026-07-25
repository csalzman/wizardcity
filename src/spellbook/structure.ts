import express from "express";
import db from "../db/databaseconnect";
const structuresRoutes = express.Router();

// Update a cell
structuresRoutes.post("/structure/", async (req: any, res: any) => {
  const { cell_id, structure } = req.body;

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
  });

  // Upsert Structure
  const structureStmt = await db.prepare(`
    INSERT INTO structures (cell_id, type)
    VALUES (?, ?)
    ON CONFLICT (cell_id)
    DO UPDATE SET 
      cell_id = excluded.cell_id,
      type = excluded.type
      RETURNING *;
  `);

  const b = await structureStmt.get([cell_id, structure]);
  console.log(b);

  // Refetch cell

  res.end();
});

export default structuresRoutes;
