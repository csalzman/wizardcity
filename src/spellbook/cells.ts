import express from "express";
import db from "../db/databaseconnect";
const cellsRoutes = express.Router();

// Update a cell
cellsRoutes.post("/cell/:cell_id", async (req: any, res: any) => {
  const cellId = req.params.cell_id;

  const { map_link, nature, description } = req.body;

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
  });

  // TODO: any additional flags here?
  const stmt = await db.prepare(`
    UPDATE cells 
    SET 
      map_link = ?, 
      nature = ?,
      description = ?
    WHERE id = (?) 
    RETURNING *
  `);

  const cell = await stmt.get([map_link, nature, description, cellId]);

  // TODO: this and the SSE write below it are nonsense and needs to be pulled into it's own function for reuse
  const htmlSnippet: any = await new Promise((resolve, reject) => {
    res.render(
      "../crystalball/map-components/cell",
      {
        cell: cell,
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

  res.write(
    `event: datastar-patch-elements\ndata: elements <div id="map-messages">Clicked: ${req.params.cell_id}</div>\n\n`,
  );

  res.end();
});

export default cellsRoutes;
