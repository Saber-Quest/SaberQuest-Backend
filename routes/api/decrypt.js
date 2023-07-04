const express = require("express")
const router = express.Router();
const { decrypt } = require("../../functions/encryption.js");
const User = require("../../models/user");
const io = require("../../websocket/websocket");

router.post("/", async (req, res) => {
    const reason = req.reason;
    const data = req.headers.user;

    const decrypted = decrypt(data);

    if (decrypted == null) return res.status(401).json({
        message: "error",
        message: "Something went wrong while decrypting the token."
    });

    switch (reason) {
        case "userId": {
            const allowed_users = ["366210991735701505", "482507481663275009"];

            if (allowed_users.includes(decrypted)) {
                res.status(200).json({
                    message: "User is allowed to use the API"
                });
            }

            else {
                res.status(401).json({
                    message: "error",
                });
            }
        }
            break;
        case "userLogin": {
            const user = await User.findOne({ userId: decrypted }).exec();

            if (user == null) {
                let hasBl = false;
                let hasSs = false;
                const beatleader = await fetch(`https://api.beatleader.xyz/player/${decrypted}`).then(res => res.json());
                if (beatleader.id != null) hasBl = true;
                const scoresaber = await fetch(`https://scoresaber.com/api/player/${decrypted}/basic`).then(res => res.json());
                if (!scoresaber.errorMessage) hasSs = true;

                let preference;

                if (hasBl) {
                    preference = "bl";
                } else if (hasSs) {
                    preference = "ss";
                } else {
                    preference = undefined;
                }

                if (preference == undefined) return res.status(401).json({
                    message: "error",
                    message: "User does not exist in any of the databases."
                });

                const newUser = new User({
                    userId: decrypted,
                    pref: preference,
                    qp: 0,
                    r: 0,
                    cp: 0,
                    value: 0,
                    collectibles: [],
                    completed: false,
                    diff: 4,
                    discordId: null
                });

                await newUser.save();

                const people = await User.find().exec();

                people.sort((a, b) => b.value - a.value);
                people.forEach((person, index) => {
                    person.r = index + 1;
                    person.save();
                });

                io.emit("newUser", {
                    userId: decrypted,
                    link: `https://saberquest.xyz/profile/${decrypted}`
                })
            }

            res.status(200).json({
                decryptedToken: decrypted
            });
        }
    }
});

module.exports = router;