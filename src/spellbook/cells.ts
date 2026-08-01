import express from "express";
import db from "../db/databaseconnect";
const cellsRoutes = express.Router();
import { cellWithEverything } from "./statements";

// Update a cell
cellsRoutes.post("/cell/:cell_id", async (req: any, res: any) => {
  const cellId = req.params.cell_id;

  const { map_link, description } = req.body;

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
  });

  const stmt = await db.prepare(`
    UPDATE cells 
    SET 
      map_link = ?, 
      description = ?
    WHERE id = (?) 
    RETURNING *
  `);

  const updatedCell = await stmt.get([map_link, description, cellId]);

  const htmlCellSidebar: any = await new Promise((resolve, reject) => {
    res.render(
      "partials/cell/cellSidebar",
      { cell: updatedCell },
      (err: any, html: any) => {
        if (err) reject(err);
        else resolve(html);
      },
    );
  });

  res.write(
    `event: datastar-patch-elements\ndata: elements ${htmlCellSidebar.replace(/\n/g, "")}\n\n`,
  );

  const htmlForCell: any = await new Promise((resolve, reject) => {
    res.render(
      "../crystalball/map-components/cell",
      {
        cell: updatedCell,
      },
      (err: any, html: any) => {
        if (err) reject(err);
        else resolve(html);
      },
    );
  });

  res.write(
    `event: datastar-patch-elements\ndata: elements ${htmlForCell.replace(/\n/g, "")}\n\n`,
  );

  res.end();
});

// Get a cell
cellsRoutes.get("/cell-sidebar/:cell_id", async (req: any, res: any) => {
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
    res.render("partials/cell/cellSidebar", { cell }, (err: any, html: any) => {
      if (err) reject(err);
      else resolve(html);
    });
  });

  res.write(
    `event: datastar-patch-elements\ndata: elements ${htmlSnippet.replace(/\n/g, "")}\n\n`,
  );

  res.end();
});

export default cellsRoutes;
