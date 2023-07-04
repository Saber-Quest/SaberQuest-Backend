const express = require("express");
const router = express.Router();
const fs = require("fs");

router.get("/", (req, res) => {
    const file = String(fs.readFileSync("./public/html/discord.html", "utf8"));
    res.send(file);
});

module.exports = router;