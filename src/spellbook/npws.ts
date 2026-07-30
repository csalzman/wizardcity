import express from "express";
import db from "../db/databaseconnect";
const npwsRoutes = express.Router();

import { npwsStmt, createNPWStmt, updateNPWStmt } from "./statements";

// Get NPWs
npwsRoutes.get("/npws/", async (req: any, res: any) => {
  const getNpwsStmt = await db.prepare(npwsStmt);
  const npws = await getNpwsStmt.all();

  const htmlSnippet: any = await new Promise((resolve, reject) => {
    res.render("partials/npw/npwList", { npws }, (err: any, html: any) => {
      if (err) reject(err);
      else resolve(html);
    });
  });

  res.write(
    `event: datastar-patch-elements\ndata: elements ${htmlSnippet.replace(/\n/g, "")}\n\n`,
  );

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

  const htmlSnippet: any = await new Promise((resolve, reject) => {
    res.render("partials/npw/npwView", { npw }, (err: any, html: any) => {
      if (err) reject(err);
      else resolve(html);
    });
  });

  res.write(
    `event: datastar-patch-elements\ndata: elements ${htmlSnippet.replace(/\n/g, "")}\n\n`,
  );

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

  const htmlSnippet: any = await new Promise((resolve, reject) => {
    res.render("partials/npw/npwList", { npws }, (err: any, html: any) => {
      if (err) reject(err);
      else resolve(html);
    });
  });

  res.write(
    `event: datastar-patch-elements\ndata: elements ${htmlSnippet.replace(/\n/g, "")}\n\n`,
  );

  res.end();
});

export default npwsRoutes;
