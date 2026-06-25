const express = require("express");
const router = express.Router();

router.get("/maps/:id", (req, res) => {
  res.send({
    cells: [
      {
        x: 0,
        y: 0,
      },
    ],
  });
});

module.exports = router;
