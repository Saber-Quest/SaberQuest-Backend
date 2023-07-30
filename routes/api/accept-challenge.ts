import { Router } from "express";
const router = Router();
import User from "../../models/user";
import { decrypt } from "../../functions/encryption";

router.post("/", async (req, res) => {
    const id = decrypt(String(req.headers.user));
    const challenge = req.query.challenge;

    console.log(id, challenge);

    try {
        const user = await User.findOne({ userId: id }).exec();
        let diff = 0;

        switch (challenge) {
            case "Easy": diff = 0; break;
            case "Normal": diff = 1; break;
            case "Hard": diff = 2; break;
            case "Extreme": diff = 3; break;
        }

        user!.diff = diff;
        await user!.save();

        res.status(200).json({
            message: 'Challenge accepted!'
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Connecting to database failed!'
        });
    }
});

export default router;