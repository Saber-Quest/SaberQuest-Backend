const express = require("express")
const router = express.Router();
const fs = require("fs")
const User = require("../../models/user.js")

let file = String(fs.readFileSync("./public/html/profile.html", "utf8"));

router.get("/", async (req, res) => {
    const ssUser = await fetch(`https://scoresaber.com/api/player/${req.id}/basic`).then(res => res.json());

    const user = await User.findOne({ userId: req.id }).exec();

    if (!user) return res.redirect("/404");

    const amountOfCollectibles = user.collectibles.map(collectible => collectible.amount).reduce((a, b) => a + b, 0);

    if (ssUser.errorMessage) return res.redirect("/profile");

    file = file.replace(/{{user}}/g, ssUser.name).replace("{{description}}", `Player Rank: #${user.r}\nAccount Value: ${user.value}\nChallenges Completed: ${user.cp}\nQuest Points: ${user.qp}\nNumber of Collectibles: ${amountOfCollectibles}`).replace("{{avatar}}", ssUser.profilePicture)

    res.send(file);
});

module.exports = router;