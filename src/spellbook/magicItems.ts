import express from "express";
import db from "../db/databaseconnect";
const magicItemsRoutes = express.Router();

import { patchElement } from "./helpers";

import {
  magicItemStmt,
  magicItemsStmt,
  createMagicItemStmt,
  updateMagicItemStmt,
} from "./statements";

magicItemsRoutes.get("/magic-items/", async (req: any, res: any) => {
  const getMagicItems = await db.prepare(magicItemsStmt);
  const magicItems = await getMagicItems.all();

  await patchElement(res, "partials/magicItems/magicItemList", { magicItems });

  res.end();
});

magicItemsRoutes.get("/magic-items/:item_name", async (req: any, res: any) => {
  const getMagicItem = await db.prepare(magicItemStmt);
  const magicItem = await getMagicItem.get([req.params.item_name]);

  await patchElement(res, "partials/magicItems/magicItemView", { magicItem });

  res.end();
});

magicItemsRoutes.post("/update-magic-item/", async (req: any, res: any) => {
  const { item_name, cell_id, facts, rarity } = req.body;

  const magicItemStmt = await db.prepare(updateMagicItemStmt);

  const magicItem = await magicItemStmt.get([
    cell_id,
    facts,
    rarity,
    item_name,
  ]);

  await patchElement(res, "partials/magicItems/magicItemView", { magicItem });

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

  await patchElement(res, "partials/magicItems/magicItemList", { magicItems });

  res.end();
});

export default magicItemsRoutes;
