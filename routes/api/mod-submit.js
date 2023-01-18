const express = require("express")
const router = express.Router();
const { decrypt } = require("../../functions/encryption.js");
const { CheckCompletion } = require("../../functions/rewards.js");

router.post("/", async (req, res) => {
    const cd = CheckCompletion(decrypt(req.user));

    if (!cd.success) return res.status(400).json({
        success: false,
        message: cd.message
    });

    res.status(200).json({
        success: true,
        message: cd.message,
        type: cd.type,
        rewards: cd.rewards
    });
});

module.exports = router;