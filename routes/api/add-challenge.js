const express = require("express")
const router = express.Router();
const { decrypt } = require("../../functions/encryption.js");
const { Challenge } = require("../../models/dailyChallenges.js");
const allowed = ["482507481663275009", "366210991735701505"]

router.post("/", async (req, res) => {
    const decrypted = decrypt(req.user);
    if (allowed.includes(decrypted)) {
        const data = req.data;

        const challenge = new Challenge({
            name: data.name,
            type: data.type,
            source: data.source,
            difficulties: data.difficulties
        });

        await challenge.save();

        res.status(200).json({
            message: "success",
            message: "Challenge added successfully."
        });
    } else {
        res.status(401).json({
            message: "error",
            message: "User is not allowed to use this endpoint."
        });
    }
});

module.exports = router;