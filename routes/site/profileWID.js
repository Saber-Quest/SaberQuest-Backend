const express = require("express")
const router = express.Router();
const fs = require("fs")
const User = require("../../models/user.js")
const colorN = require("fast-average-color-node")

router.get("/", async (req, res) => {
    let file = String(fs.readFileSync("./public/html/profile.html", "utf8"));

    const user = await User.findOne({ userId: req.id }).exec();

    if (!user) return res.redirect("/404");

    const color = await colorN.getAverageColor(user.avatar)
    const hex = color.hex

    const amountOfCollectibles = user.collectibles.map(collectible => collectible.amount).reduce((a, b) => a + b, 0);

    file = file.replace(/{{user}}/g, user.username).replace("{{description}}", `Player Rank: #${user.r}\nAccount Value: ${user.value}\nChallenges Completed: ${user.cp}\nQuest Points: ${user.qp}\nNumber of Collectibles: ${amountOfCollectibles}`).replace("{{avatar}}", user.avatar).replace("{{color}}", hex);

    return res.send(file);
});

module.exports = router;