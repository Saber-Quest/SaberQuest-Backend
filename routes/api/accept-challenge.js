const express = require("express")
const router = express.Router();
const User = require("../../models/user.js");
const { decrypt } = require("../../functions/encryption.js");

router.post("/", async (req, res) => {
    const id = decrypt(req.token);
    const challenge = req.challenge;

    try {
        const user = await User.findOne({ userId: id }).exec();
        let diff;

        switch (challenge) {
            case "Easy": diff = 0; break;
            case "Normal": diff = 1; break;
            case "Hard": diff = 2; break;
            case "Extreme": diff = 3; break;
        }

        await User.updateOne({ userId: id }, { diff: diff });

        res.status(200).json({
            message: 'Challenge accepted!'
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