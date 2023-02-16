const express = require("express")
const router = express.Router();
const User = require("../../models/user.js");
const shop = require("../../models/shop.js");
const { decrypt } = require("../../functions/encryption.js");
const io = require("../../websocket/websocket");

router.patch("/", async (req, res) => {
    const userId = decrypt(req.token);
    const collectible1 = req.item1;
    const collectible2 = req.item2;
    const type = req.query.type;

    try {
        const user = await User.findOne({ userId: userId }).exec();
        const itemData1 = await shop.findOne({ id: collectible1 }).exec();
        const itemData2 = await shop.findOne({ id: collectible2 }).exec();

        for (const item of user.collectibles) {
            if (item.name === collectible1 || item.name === collectible2) {
                if (type === 'add') {
                    item.amount++;
                } else if (type === 'remove') {
                    if (collectible1 == collectible2) {
                        item.amount -= 2;
                    }
                    else {
                        item.amount--;
                    }
                }
            }
        }

        if (type === 'add') {
            user.value += itemData1.value;
        } else if (type === 'remove') {
            user.value -= (itemData1.value + itemData2.value);
        }


        await User.updateOne({ userId: userId }, { collectibles: user.collectibles, value: user.value });

        if (type === 'add') {
            io.emit("userUpdate", {
                userId: userId,
                type: "add",
                collectibles: collectible1,
                value: user.value
            })
        }

        else {
            io.emit("userUpdate", {
                userId: userId,
                type: "remove",
                collectibles: [collectible1, collectible2],
                value: user.value
            })
        }

        res.status(200).json({
            message: 'User updated successfully!',
            user: user.userId,
            collectibles: user.collectibles
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Connecting to database failed!'
        });
    }
});

module.exports = router;