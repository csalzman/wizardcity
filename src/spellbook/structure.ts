import express from "express";
import db from "../db/databaseconnect";
const structuresRoutes = express.Router();

import { cellWithEverything } from "./statements";

import { patchElement, patchElementNoTemplate } from "./helpers";

// Update a structure
structuresRoutes.post("/structure/", async (req: any, res: any) => {
  const { cell_id, structure_image } = req.body;

  if (!structure_image) {
    await patchElementNoTemplate(
      res,
      `<div id='structure-update'>Error updating ${cell_id}. No image</div>`,
    );
    res.end();
  }

  try {
    const structureStmt = await db.prepare(`
      UPDATE cells
      SET structure_image = ?
      WHERE id = ?
      RETURNING *;
    `);

    const b = await structureStmt.get([
      structure_image === "none" ? undefined : structure_image,
      cell_id,
    ]);
  } catch {
    await patchElementNoTemplate(
      res,
      `<div id='structure-update'>Error updating ${cell_id} with ${structure_image}</div>`,
    );
    return res.end();
  }

  // Get cell
  const getCellStmt = await db.prepare(cellWithEverything);
  const cell = await getCellStmt.get([cell_id]);

  if (!cell) {
    await patchElementNoTemplate(
      res,
      `<div id='structure-update'>Error finding cell ${cell_id}.`,
    );
    return res.end();
  }

  await patchElementNoTemplate(
    res,
    `<div id='structure-update'>${cell_id} updated with ${structure_image}`,
  );

  await patchElement(res, "map-components/cell", { cell });

  res.end();
});

export default structuresRoutes;
