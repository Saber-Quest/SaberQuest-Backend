const express = require("express")
const router = express.Router();
const User = require("../../models/user.js");
const { decrypt } = require("../../functions/encryption.js");

router.patch("/", async (req, res) => {
    const userId = decrypt(req.token);
    const collectible1 = req.item1;
    const collectible2 = req.item2;
    const type = req.query.type;

    try {
        const user = await User.findOne({ userId: userId }).exec();

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