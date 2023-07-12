const express = require("express")
const router = express.Router();
const fs = require("fs");

router.get("/", async (req, res) => {
    try {
        const dailyChallenges = JSON.parse(fs.readFileSync("./data/currentChallenge.json", "utf8"));

        let task;

        switch (dailyChallenges.type) {
            case "pp": task = "Get a play that is worth at least this much PP:"; break;
            case "FCStars": task = "Get an FC (Full Combo) on a map with at least this many stars:"; break;
            case "xAccuracyStars": task = "Get at least this much accuracy on a map with at least this many stars:"; break;
            case "xAccuracyPP": task = "Get at least this much accuracy on a map that is worth at least this much PP:"; break;
            case "playXMaps": task = "Play at least this many maps:"; break;
            case "FCNotes": task = "Get an FC (Full Combo) on a map with at least this many notes:"; break;
            case "passNotes": task = "Pass a map with at least this many notes:"; break;
            case "passLength": task = "Pass a map that is at least this long:"; break;
        }

        res.status(200).json({
            message: 'Daily Challenges fetched successfully!',
            type: dailyChallenges.type,
            task: task,
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