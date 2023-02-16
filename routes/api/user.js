const express = require("express")
const router = express.Router();
const User = require("../../models/user.js");
const { decrypt } = require("../../functions/encryption.js");

router.get("/", async (req, res) => {
    let userId;

    if (req.auth == "auth") userId = decrypt(req.id);
    else userId = req.id;

    try {
        const user = await User.findOne({ userId: userId }).exec();

        if (!user) return res.status(404).json({
            message: 'User not found!'
        });

        res.status(200).json({
            message: 'User fetched successfully!',
            user: user.userId,
            preference: user.pref,
            rank: user.r,
            qp: user.qp,
            challengesCompleted: user.cp,
            collectibles: user.collectibles.map(collectible => { return { name: collectible.name, amount: collectible.amount } }),
            value: user.value,
            diff: user.diff,
            completed: user.completed
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Fetching user failed!'
        });
    }
});

module.exports = router;