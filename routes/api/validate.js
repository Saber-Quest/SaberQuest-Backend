const express = require("express")
const router = express.Router();
const { decrypt } = require("../../functions/encryption.js");
const { CheckCompletion } = require("../../functions/rewards.js");

router.post("/", async (req, res) => {
    const decrypted = decrypt(req.token);
    const userId = req.id;

    if (decrypted == userId) {
        const cd = await CheckCompletion(userId);

        if (cd == true) {
            res.status(200).json({
                success: false,
                message: "This profile has already been updated within an hour."
            });
        }

        else if (cd == null) {
            res.status(200).json({
                success: false,
                message: "This profile already completed the daily challenge."
            });
        }

        else if (cd == "no-diff") {
            res.status(200).json({
                success: false,
                message: "This profile has not accepted a challenge yet."
            });
        }

        else {
            res.status(200).json({
                success: true,
                message: cd.message,
                difficulty: cd.difficulty,
                rewards: cd.rewards
            });
        }

    }

    else {
        res.status(401).json({
            success: false,
            message: "You are not allowed to do this."
        });
    }
});

module.exports = router;