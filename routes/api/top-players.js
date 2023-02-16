const express = require("express")
const router = express.Router();
const User = require("../../models/user.js");

router.get("/", async (req, res) => {
    const page = req.page;
    try {
        let topPlayers = await User.find().sort({ value: -1 }).select("userId value cp r");

        topPlayers = topPlayers.sort((a, b) => a.r - b.r).slice((page - 1) * 10, page * 10);

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