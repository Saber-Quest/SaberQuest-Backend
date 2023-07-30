import { Router } from "express";
const router = Router();
import User from "../../models/user";

router.get("/", async (req, res) => {
    const page = Number(req.query.page);
    const amount = Number(req.query.amount) || 50;

    // Checks!

    if (amount > 50) return res.status(400).json({ message: "Amount must be less than or equal to 50" });
    if (amount < 1) return res.status(400).json({ message: "Amount must be greater than 0" });
    if (isNaN(amount)) return res.status(400).json({ message: "Amount must be a number" });
    if (page < 1) return res.status(400).json({ message: "Page must be greater than 0" });
    if (isNaN(page)) return res.status(400).json({ message: "Page must be a number" });

    try {
        let topPlayers = await User.find().sort({ value: -1 }).select("userId value cp r pref avatar username");

        topPlayers = topPlayers.sort((a, b) => a.r - b.r).slice((page - 1) * amount, page * amount);

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

export default router;