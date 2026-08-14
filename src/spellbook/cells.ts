import express from "express";
import db from "../db/databaseconnect";
const cellsRoutes = express.Router();
import { cellWithEverything } from "./statements";

import { patchElement } from "./helpers";

// Update a cell
cellsRoutes.post("/cell/:cell_id", async (req: any, res: any) => {
  const cellId = req.params.cell_id;

  const { cell_link, description } = req.body;

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
  });

  const stmt = await db.prepare(`
    UPDATE cells 
    SET 
      cell_link = ?, 
      description = ?
    WHERE id = (?) 
    RETURNING id
  `);

  // Update cell
  const cell = await stmt.get([cell_link, description, cellId]);

  // Now get it with everything we need
  const updatedCellStmt = await db.prepare(cellWithEverything);

  const updatedCell = await updatedCellStmt.get([cell.id]);

  await patchElement(res, "partials/cell/cellSidebar", { cell: updatedCell });

  await patchElement(res, "../crystalball/map-components/cell", {
    cell: updatedCell,
  });

  res.end();
});

// Get a cell
cellsRoutes.get("/cell-sidebar/:cell_id", async (req: any, res: any) => {
  const isHomepage = req.query.homepage;

  // Get cell
  const cellId = req.params.cell_id;
  const getCellStmt = await db.prepare(cellWithEverything);
  const cell = await getCellStmt.get([cellId]);

  // If no map found return early
  if (!cell) {
    res.send("<p>No Cell</p>");
    return res.end();
  }

  const htmlSnippet: any = await new Promise((resolve, reject) => {
    res.render(
      // lol
      isHomepage === "true"
        ? "partials/cell/homepageCellSidebar"
        : "partials/cell/cellSidebar",
      { cell },
      (err: any, html: any) => {
        if (err) reject(err);
        else resolve(html);
      },
    );
  });

  res.write(
    `event: datastar-patch-elements\ndata: elements ${htmlSnippet.replace(/\n/g, "")}\n\n`,
  );

  res.end();
});

export default cellsRoutes;
