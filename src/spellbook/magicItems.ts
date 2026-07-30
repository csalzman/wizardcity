import express from "express";
import db from "../db/databaseconnect";
const magicItemsRoutes = express.Router();

import {
  magicItemsStmt,
  createMagicItemStmt,
  updateMagicItemStmt,
} from "./statements";

magicItemsRoutes.get("/magic-items/", async (req: any, res: any) => {
  const getMagicItems = await db.prepare(magicItemsStmt);
  const magicItems = await getMagicItems.all();

  const htmlSnippet: any = await new Promise((resolve, reject) => {
    res.render(
      "partials/magicItems/magicItemList",
      { magicItems },
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

magicItemsRoutes.post("/update-magic-item/", async (req: any, res: any) => {
  const { item_name, cell_id, facts, rarity } = req.body;

  // Upsert Structure
  const magicItemStmt = await db.prepare(updateMagicItemStmt);

  const magicItem = await magicItemStmt.get([
    cell_id,
    facts,
    rarity,
    item_name,
  ]);

  const htmlSnippet: any = await new Promise((resolve, reject) => {
    res.render(
      "partials/magicItems/magicItemView",
      { magicItem },
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

magicItemsRoutes.post("/create-magic-item/", async (req: any, res: any) => {
  const { item_name, cell_id, facts, rarity } = req.body;

  // Insert NPW
  const createStmt = await db.prepare(createMagicItemStmt);

  const magicItem = await createStmt.get([item_name, cell_id, facts, rarity]);

  // Get list and update list
  const getMagicItemsStmt = await db.prepare(magicItemsStmt);
  const magicItems = await getMagicItemsStmt.all();

  const htmlSnippet: any = await new Promise((resolve, reject) => {
    res.render(
      "partials/magicItems/magicItemList",
      { magicItems },
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

export default magicItemsRoutes;
