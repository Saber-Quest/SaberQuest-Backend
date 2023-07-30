import { Router } from "express";
const router = Router();
import * as fs from "node:fs";
import User from "../../models/user";
import * as colorN from "fast-average-color-node";

router.get("/", (req, res) => {
    let file = String(fs.readFileSync("./public/html/profile.html", "utf8"));

    file = file.replace("{{user}}'s Profile", "Login").replace("{{description}}", "Login right here to get started 😎").replace("{{avatar}}", "https://cdn.discordapp.com/attachments/830384076703793162/1071811817027944530/icon.png").replace("{{user}}", "Login")

    res.send(file);
});

router.get("/:id", async (req, res) => {
    let file = String(fs.readFileSync("./public/html/profile.html", "utf8"));

    const user = await User.findOne({ userId: req.params.id }).exec();

    if (!user) return res.redirect("/404");

    const color = await colorN.getAverageColor(user.avatar)
    const hex = color.hex

    const amountOfCollectibles = user.collectibles.map(collectible => collectible.amount).reduce((a, b) => a + b, 0);

    file = file.replace(/{{user}}/g, user.username).replace("{{description}}", `Player Rank: #${user.r}\nAccount Value: ${user.value}\nChallenges Completed: ${user.cp}\nQuest Points: ${user.qp}\nNumber of Collectibles: ${amountOfCollectibles}`).replace("{{avatar}}", user.avatar).replace("{{color}}", hex);

    return res.send(file);
});

export default router;