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

        let name;
        let country;
        let profilePicture;
        switch (user.pref) {
            case "ss": {
                await fetch(`https://scoresaber.com/api/player/${user.userId}/basic`).then(res => res.json()).then(json => {
                    name = json.name;
                    country = json.country;
                    profilePicture = json.profilePicture;
                });
            }
            case "bl": {
                await fetch(`https://api.beatleader.xyz/player/${user.userId}`).then(res => res.json()).then(json => {
                    name = json.name;
                    country = json.country;
                    profilePicture = json.avatar;
                });
            }
        }

        res.status(200).json({
            message: 'User fetched successfully!',
            user: user.userId,
            name: name,
            country: country,
            profilePicture: profilePicture,
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