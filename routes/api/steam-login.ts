import { Router } from "express";
const router = Router();
import { encrypt } from "../../functions/encryption";

router.get("/", async (req, res) => {
    const request = String(req.query['openid.identity'])
    const id = request.split("/")[5];

    const encrypted = encrypt(id);

    res.redirect(`https://saberquest.xyz/profile#${encrypted}`);
});

export default router;