import express from "express";
import db from "../db/databaseconnect";
const wizardRoutes = express.Router();

// Get all wizards
wizardRoutes.get("/wizards", async (req: any, res: any) => {
  const stmt = await db.prepare("SELECT * FROM wizards");

  const wizards = await stmt.all();

  res.json(wizards);
});

// Create a new wizard
// TODO: this will need to require a password too
wizardRoutes.post("/wizards", async (req: any, res: any) => {
  const stmt = await db.prepare(
    "INSERT INTO wizards (wizard_name, email, color) VALUES ('fooa', 'bara', 'baza')",
  );

  const wizard = await stmt.get();
  console.log(wizard);

  res.send(`<div id='wizard'>Wizard created: ${wizard.wizard_name}</div>`);
});

// Get a single wizard
wizardRoutes.get("/wizards/:wizard_name", async (req: any, res: any) => {
  const stmt = await db.prepare("SELECT * FROM wizards WHERE wizard_name = ?");

  const wizard = await stmt.get(req.params.wizard_name);

  console.log(wizard);

  res.json(wizard);
});

export default wizardRoutes;
