import { Router } from "express";
const router = Router();
import User from "../../models/user";
import { decrypt } from "../../functions/encryption";

router.get("/:id", async (req, res) => {
    const userId: string | null = req.params.id;

    try {
        const user = await User.findOne({ userId: userId }).exec();

        if (!user) return res.status(404).json({
            message: 'User not found!'
        });

        res.status(200).json({
            message: 'User fetched successfully!',
            user: user.userId,
            username: user.username,
            avatar: user.avatar,
            preference: user.pref,
            rank: user.r,
            qp: user.qp,
            challengesCompleted: user.cp,
            collectibles: user.collectibles.map(collectible => { return { name: collectible.name, amount: collectible.amount } }),
            value: user.value,
            diff: user.diff,
            completed: user.completed
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Fetching user failed!'
        });
    }
});

router.get("/", async (req, res) => {
    const userId = decrypt(String(req.headers.user));

    try {
        const user = await User.findOne({ userId: userId }).exec();

        if (!user) return res.status(404).json({
            message: 'User not found!'
        });

        res.status(200).json({
            message: 'User fetched successfully!',
            user: user.userId,
            username: user.username,
            avatar: user.avatar,
            preference: user.pref,
            rank: user.r,
            qp: user.qp,
            challengesCompleted: user.cp,
            collectibles: user.collectibles.map(collectible => { return { name: collectible.name, amount: collectible.amount } }),
            value: user.value,
            diff: user.diff,
            completed: user.completed
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Fetching user failed!'
        });
    }
});

export default router;