import express from "express";
import db from "../db/databaseconnect";
const structuresRoutes = express.Router();

import { cellWithEverything } from "./statements";

// Update a structure
structuresRoutes.post("/structure/", async (req: any, res: any) => {
  const { cell_id, structure_image } = req.body;

  if (!structure_image) res.end();

  // Upsert Structure
  const structureStmt = await db.prepare(`
    UPDATE cells
    SET structure_image = ?
    WHERE id = ?
    RETURNING *;
  `);

  const b = await structureStmt.get([structure_image, cell_id]);

  // Get cell
  const getCellStmt = await db.prepare(cellWithEverything);
  const cell = await getCellStmt.get([cell_id]);

  // If no map found return early
  if (!cell) {
    res.send("<p>No Cell</p>");
    return res.end();
  }

  const htmlSnippet: any = await new Promise((resolve, reject) => {
    res.render("map-components/cell", { cell }, (err: any, html: any) => {
      if (err) reject(err);
      else resolve(html);
    });
  });

  res.write(
    `event: datastar-patch-elements\ndata: elements ${htmlSnippet.replace(/\n/g, "")}\n\n`,
  );

  res.end();
});

export default structuresRoutes;
