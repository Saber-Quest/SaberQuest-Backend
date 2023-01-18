const express = require("express")
const router = express.Router();
const fs = require("fs")

let file = String(fs.readFileSync("./public/html/profile.html", "utf8"));

router.get("/", (req, res) => {
    file = file.replace("{{user}}", "Login")

    res.send(file);
});

module.exports = router;