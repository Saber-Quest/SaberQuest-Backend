const express = require("express")
const router = express.Router();
const DailyChallenge = require("../../models/dailyChallenges.js");

router.get("/", async (req, res) => {
    try {
        const dailyChallenges = await DailyChallenge.findOne().exec();

        res.status(200).json({
            message: 'Daily Challenges fetched successfully!',
            type: dailyChallenges.type,
            dailyChallenges: dailyChallenges.difficulties
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Fetching daily challenges failed!'
        });
    }
});

module.exports = router;