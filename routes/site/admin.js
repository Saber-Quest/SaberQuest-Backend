const express = require("express")
const router = express.Router();
const fs = require("fs")

const file = String(fs.readFileSync("./public/html/admin.html", "utf8"));

router.get("/", (req, res) => {
    res.send(file)
})

module.exports = router;