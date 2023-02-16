const express = require("express")
const router = express.Router();
const shop = require("../../models/shop.js");
const User = require("../../models/user.js");
const { decrypt } = require("../../functions/encryption.js");
const io = require("../../websocket/websocket");

router.post("/", async (req, res) => {
    const userId = decrypt(req.headers.user);
    const user = await User.findOne({ userId: userId }).exec();

    if (user.qp < 20) return res.status(400).json({ success: false, error: "You don't have enough QP to gamble" });

    // Choose a random rarity
    // The chance of getting common is 50%, uncommon is 30%, rare is 15%, epic is 4%, legendary is 1%

    user.qp -= 20;

    const rarity = Math.floor(Math.random() * 100);

    let chosenRarity;

    if (rarity < 50) chosenRarity = "Common";
    else if (rarity < 80) chosenRarity = "Uncommon";
    else if (rarity < 95) chosenRarity = "Rare";
    else if (rarity < 99) chosenRarity = "Epic";
    else chosenRarity = "Legendary";

    // Choose a random item from the chosen rarity

    const items = await shop.find({ rarity: chosenRarity }).exec();

    const chosenItem = items[Math.floor(Math.random() * items.length)];

    const collectible = chosenItem.id;

    // Give the user the item
    let collectibles = user.collectibles;

    const currentCollectibles = collectibles.map(collectible => collectible.name);
    if (currentCollectibles.includes(collectible)) {
        const index = currentCollectibles.indexOf(collectible);
        if (collectible == "rs" || collectible == "bs") return collectibles[index].amount += 20;
        collectibles[index].amount++;
    } else {
        if (collectible == "rs" || collectible == "bs") return collectibles.push({
            name: collectible,
            amount: 20,
        });
        collectibles.push({
            name: collectible,
            amount: 1,
        });
    }

    user.collectibles = collectibles;

    io.emit("gamble", {
        userId: user.userId,
        itemWon: chosenItem.id,
        rarity: chosenItem.rarity
    })

    await user.save();

    res.status(200).json({
        success: true,
        itemWon: chosenItem.id,
        rarity: chosenItem.rarity
    });
});

module.exports = router;