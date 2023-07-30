import { Router } from "express";
const router = Router();
import { decrypt } from "../../functions/encryption";
import CheckCompletion from "../../functions/rewards";

router.post("/", async (req, res) => {
    const decrypted = decrypt(String(req.headers.user));
    const userId = req.query.pageId;

    if (decrypted == userId) {
        const cd = await CheckCompletion(userId);

        if (cd == true) {
            res.status(200).json({
                success: false,
                message: "You can only update your profile once per 5 minutes!"
            });
        }

        else if (cd == null) {
            res.status(200).json({
                success: false,
                message: "This profile already completed the daily challenge."
            });
        }

        else if (cd == "no-diff") {
            res.status(200).json({
                success: false,
                message: "This profile has not accepted a challenge yet."
            });
        }

        else if (cd == "not-completed") {
            res.status(200).json({
                success: false,
                message: "This profile does not meet the requirements to complete the challenge."
            });
        }

        else {
            res.status(200).json({
                success: true,
                // @ts-ignore
                message: cd.message,
                // @ts-ignore
                difficulty: cd.difficulty,
                // @ts-ignore
                rewards: cd.rewards
            });
        }

    }

    else {
        res.status(401).json({
            success: false,
            message: "You are not allowed to do this."
        });
    }
});

export default router;