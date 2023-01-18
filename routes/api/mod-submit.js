const express = require("express")
const router = express.Router();
const { decrypt } = require("../../functions/encryption.js");
const { CheckCompletion } = require("../../functions/rewards.js");

router.post("/", async (req, res) => {
    const cd = CheckCompletion(decrypt(req.headers.user));

    if (cd) {
        res.status(200).json({
            success: false,
            message: "This profile has already been updated within an hour."
        });
    }

    else {
        res.status(200).json({
            success: true,
            message: cd.message,
            type: cd.type,
            rewards: cd.rewards
        });
    }
});

module.exports = router;