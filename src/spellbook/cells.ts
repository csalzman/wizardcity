import express from "express";
import db from "../db/databaseconnect";
const cellsRoutes = express.Router();

// Create cells. Should only be used to generate map initially
cellsRoutes.post("/cells", async (req: any, res: any) => {
  const { height, width, map } = req.body;

  // TODO: any additional flags here?
  const stmt = await db.prepare(
    "INSERT INTO cells (map, x, y) VALUES (?, ?, ?)",
  );

  // TODO: loop through height and width to create cells
  for (let h = 0; h <= height; h++) {
    for (let w = 0; w <= width; w++) {
      await stmt.get([req.body.map, h, w]);
    }
  }

  res.json();
});

export default cellsRoutes;
