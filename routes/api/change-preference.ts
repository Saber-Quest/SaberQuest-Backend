import { Router } from "express";
const router = Router();
import { decrypt } from "../../functions/encryption";
import User from "../../models/user";

router.post("/", async (req, res) => {
    const id = decrypt(String(req.headers.token));

    if (req.query.pref !== "ss" && req.query.pref !== "bl") return res.status(400).json({
        message: 'Invalid preference!'
    });

    try {
        await User.findOneAndUpdate({ userId: id }, { pref: req.query.pref });

        res.status(200).json({
            success: true,
            message: 'Preference updated successfully!',
            pref: req.query.pref
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Connecting to database failed!'
        });
    }
});

export default router;