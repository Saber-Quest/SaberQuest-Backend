const express = require("express")
const router = express.Router();
const fs = require("fs")    
const User = require("../../models/user.js")
const colorN = require("fast-average-color-node");

router.get("/", async (req, res) => {
    let file = String(fs.readFileSync("./public/html/profile.html", "utf8"));

    const user = await User.findOne({ userId: req.id }).exec();

    if (!user) return res.redirect("/404");

    const amountOfCollectibles = user.collectibles.map(collectible => collectible.amount).reduce((a, b) => a + b, 0);

    if (user.pref == "ss") {
        const ssUser = await fetch(`https://scoresaber.com/api/player/${req.id}/basic`).then(res => res.json());

        if (ssUser.errorMessage) return res.redirect("/profile");
    
        const avatar = ssUser.profilePicture;
    
        const color = await colorN.getAverageColor(avatar);
        const hex = color.hex;
    
        file = file.replace(/{{user}}/g, ssUser.name).replace("{{description}}", `Player Rank: #${user.r}\nAccount Value: ${user.value}\nChallenges Completed: ${user.cp}\nQuest Points: ${user.qp}\nNumber of Collectibles: ${amountOfCollectibles}`).replace("{{avatar}}", avatar).replace("{{color}}", hex);
    
        return res.send(file);
    }

    else {
        const blUser = await fetch(`https://api.beatleader.xyz/player/${req.id}`).then(res => res.json());

        if (blUser.id == null) return res.redirect("/profile");

        const avatar = blUser.avatar;

        const color = await colorN.getAverageColor(avatar);
        const hex = color.hex;

        file = file.replace(/{{user}}/g, blUser.name).replace("{{description}}", `Player Rank: #${user.r}\nAccount Value: ${user.value}\nChallenges Completed: ${user.cp}\nQuest Points: ${user.qp}\nNumber of Collectibles: ${amountOfCollectibles}`).replace("{{avatar}}", avatar).replace("{{color}}", hex);

        return res.send(file);
    }
});

module.exports = router;