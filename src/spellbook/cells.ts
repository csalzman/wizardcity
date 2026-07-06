import express from "express";
import db from "../db/databaseconnect";
const cellsRoutes = express.Router();

import { sendDatastarBroadcast } from "./events";

// Create cells. Should only be used to generate map initially
// cellsRoutes.post("/cells", async (req: any, res: any) => {
//   const { height, width, map } = req.body;

//   // TODO: any additional flags here?
//   const stmt = await db.prepare(
//     "INSERT INTO cells (map, x, y) VALUES (?, ?, ?)",
//   );

//   // TODO: loop through height and width to create cells
//   for (let h = 0; h <= height; h++) {
//     for (let w = 0; w <= width; w++) {
//       await stmt.get([req.body.map, h, w]);
//     }
//   }

//   res.json();
// });

// Create cells. Should only be used to generate map initially
cellsRoutes.post("/cell/:cell_id", async (req: any, res: any) => {
  const cellId = req.params.cell_id;

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
  });

  // TODO: any additional flags here?
  const stmt = await db.prepare(
    "UPDATE cells SET color = 'red' WHERE id = (?) RETURNING *",
  );

  const cell = await stmt.get(cellId);

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

  await sendDatastarBroadcast(htmlSnippet.replace(/\n/g, ""));

  // res.write(
  //   `event: datastar-patch-elements\ndata: elements ${htmlSnippet.replace(/\n/g, "")}\n\n`,
  // );

  res.write(
    `event: datastar-patch-elements\ndata: elements <div id="map-messages">Clicked: ${req.params.cell_id}</div>\n\n`,
  );

  res.end();
});

export default cellsRoutes;
