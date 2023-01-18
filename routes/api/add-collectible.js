const express = require("express");
const router = express.Router();
const User = require("../../models/user.js");
const { decrypt } = require("../../functions/encryption.js");

router.put("/", async (req, res) => {
    const userId = decrypt(req.token);
    const collectible = req.item;

    try {
        const user = await User.findOne({ userId: userId }).exec();

        user.collectibles.push({ name: collectible, amount: 1 });

        await User.updateOne({ userId: userId }, { collectibles: user.collectibles });

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