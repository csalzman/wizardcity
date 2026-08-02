import express from "express";
import db from "../db/databaseconnect";
const npwsRoutes = express.Router();

import { patchElement } from "./helpers";

import { npwStmt, npwsStmt, createNPWStmt, updateNPWStmt } from "./statements";

// Get NPWs
npwsRoutes.get("/npws/", async (req: any, res: any) => {
  const getNpwsStmt = await db.prepare(npwsStmt);
  const npws = await getNpwsStmt.all();

  await patchElement(res, "partials/npw/npwList", { npws });

  res.end();
});

// Get NPW
npwsRoutes.get("/npws/:wizard_name", async (req: any, res: any) => {
  const getNpwStmt = await db.prepare(npwStmt);
  const npw = await getNpwStmt.get([req.params.wizard_name]);

  await patchElement(res, "partials/npw/npwView", { npw });

  res.end();
});

// Update NPW
npwsRoutes.post("/update-npw/", async (req: any, res: any) => {
  const { wizard_name, cell_id, wizard_class, HP, facts } = req.body;

  const npwStmt = await db.prepare(updateNPWStmt);

  const npw = await npwStmt.get([
    cell_id,
    wizard_class,
    HP,
    facts,
    wizard_name,
  ]);

  await patchElement(res, "partials/npw/npwView", { npw });

  res.end();
});

// Update NPW
npwsRoutes.post("/create-npw/", async (req: any, res: any) => {
  const { wizard_name, cell_id, wizard_class, HP, facts } = req.body;

  // Insert NPW
  const npwStmt = await db.prepare(createNPWStmt);

  const npw = await npwStmt.get([
    wizard_name,
    cell_id,
    wizard_class,
    HP,
    facts,
  ]);

  // Get list and update list
  const getNpwsStmt = await db.prepare(npwsStmt);
  const npws = await getNpwsStmt.all();

  await patchElement(res, "partials/npw/npwList", { npws });

  res.end();
});

export default npwsRoutes;
