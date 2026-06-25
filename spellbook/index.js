import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello WIZARDS!");
});

app.get("/map", (req, res) => {
  res.send({
    cells: [
      {
        x: 0,
        y: 0,
      },
    ],
  });
});

app.listen(3000, () => {
  console.log("SPELLBOOK is running on http://localhost:3000");
});
