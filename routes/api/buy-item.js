const express = require("express")
const router = express.Router();
const { decrypt } = require("../../functions/encryption.js");
const User = require("../../models/user");
const shop = require("../../models/shop");
const io = require("../../websocket/websocket");

router.post("/", async (req, res) => {
    const token = req.token;
    const item = req.item

    const id = decrypt(token);

    const user = await User.findOne({ userId: id }).exec();

    const itemData = await shop.findOne({ id: item }).exec();

    if (user.qp >= itemData.price) {
        let collectibles = user.collectibles;

        const collectible = collectibles.find(collectible => collectible.name === itemData.id);

        if (collectible) {
            collectible.amount += 1;
        } else {
            collectibles.push({ name: itemData.id, amount: 1 });
        }

        user.qp -= itemData.price;

        await User.updateOne({ userId: id }, { qp: user.qp, collectibles: collectibles, value: user.value + itemData.value });

        io.emit("itemBought", {
            userId: id,
            item: itemData.id,
            qp: user.qp,
            value: user.value + itemData.value
        });

        res.status(200).json({
            success: true,
            message: "User updated successfully!",
            user: user.userId,
            item: itemData.id,
        });
    } else {
        res.status(200).json({
            message: "User does not have enough QP to buy this item"
        });
    }
});

module.exports = router;