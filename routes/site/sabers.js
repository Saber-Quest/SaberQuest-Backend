const express = require("express")
const router = express.Router();
const fs = require("fs")

let file = String(fs.readFileSync("./public/html/sabers.html", "utf8"));

router.get("/", (req, res) => {
    res.send(file);
});

module.exports = router;