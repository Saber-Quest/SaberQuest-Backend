const express = require("express")
const router = express.Router();
const { decrypt } = require("../../functions/encryption.js");
const User = require("../../models/user.js");

router.post("/", async (req, res) => {
    const id = decrypt(req.token);

    if (req.pref !== "ss" && req.pref !== "bl") return res.status(400).json({
        message: 'Invalid preference!'
    });

    try {
        await User.findOneAndUpdate({ userId: id }, { pref: req.pref });

        res.status(200).json({
            success: true,
            message: 'Preference updated successfully!',
            pref: req.pref
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Connecting to database failed!'
        });
    }
});

module.exports = router;