import { Router } from "express";
const router = Router();
import shop from "../../models/shop";
import User from "../../models/user";
import { decrypt } from "../../functions/encryption";
import io from "../../websocket/websocket";

router.post("/", async (req, res) => {
    const userId = decrypt(String(req.headers.user));
    const user = await User.findOne({ userId: userId }).exec();

    if (user!.qp < 20) return res.status(400).json({ success: false, error: "You don't have enough QP to gamble" });

    // Choose a random rarity
    // The chance of getting common is 50%, uncommon is 30%, rare is 15%, epic is 4%, legendary is 1%

    user!.qp -= 20;

    const rarity = Math.floor(Math.random() * 100);

    let chosenRarity: string = "";

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
    let collectibles = user!.collectibles;

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

    user!.collectibles = collectibles;

    user!.value += Number(chosenItem.value);

    io.emit("gamble", {
        userId: user!.userId,
        itemWon: chosenItem.id,
        rarity: chosenItem.rarity
    })

    await user!.save();

    const people = await User.find().exec();

    people.sort((a, b) => b.value - a.value);
    people.forEach((person, index) => {
        person.r = index + 1;
        person.save();
    });

    res.status(200).json({
        success: true,
        itemWon: chosenItem.id,
        rarity: chosenItem.rarity,
        qp: user!.qp
    });
});

export default router;