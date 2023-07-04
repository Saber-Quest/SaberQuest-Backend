const express = require("express");
const router = express.Router();
const User = require("../../models/user.js");
const shop = require("../../models/shop.js");
const { decrypt } = require("../../functions/encryption.js");
const io = require("../../websocket/websocket");

router.put("/", async (req, res) => {
    const userId = decrypt(req.token);
    const collectible = req.item;

    try {
        const user = await User.findOne({ userId: userId }).exec();

        const itemData = await shop.findOne({ id: collectible }).exec();

        user.collectibles.push({ name: itemData.id, amount: 1 });

        await User.updateOne({ userId: userId }, { collectibles: user.collectibles, value: user.value + itemData.value });

        io.emit("userUpdate", {
            userId: userId,
            type: "add",
            collectibles: collectible,
            value: user.value
        });

        const people = await User.find().exec();

        people.sort((a, b) => b.value - a.value);
        people.forEach((person, index) => {
            person.r = index + 1;
            person.save();
        });

        res.status(200).json({
            success: true,
            message: "User updated successfully!",
            user: user.userId,
            collectible: itemData.id,
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