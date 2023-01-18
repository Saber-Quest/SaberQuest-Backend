const express = require("express")
const router = express.Router();
const User = require("../../models/user.js");

router.get("/", async (req, res) => {
    const page = req.query.page;
    try {
        const topPlayers = await User.find().sort({ value: -1 }).select("userId value cp");

        topPlayers.splice(0, (page - 1) * 10);

        res.status(200).json({
            message: 'Top players fetched successfully!',
            topPlayers: topPlayers
        });
    }

    catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Fetching top players failed!'
        });
    }
});

module.exports = router;