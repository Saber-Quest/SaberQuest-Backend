const express = require("express")
const router = express.Router();
const fs = require("fs")

let file = String(fs.readFileSync("./public/html/profile.html", "utf8"));

router.get("/", (req, res) => {
    file = file.replace("{{user}}'s Profile", "Login").replace("{{description}}", "Login right here to get started 😎").replace("{{avatar}}", "https://cdn.discordapp.com/attachments/830384076703793162/1071811817027944530/icon.png").replace("{{user}}", "Login")

    res.send(file);
});

module.exports = router;