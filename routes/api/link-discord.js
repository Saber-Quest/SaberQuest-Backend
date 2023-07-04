const express = require("express");
const router = express.Router();
const { encrypt } = require("../../functions/encryption.js");


router.get("/", async (req, res) => {
    const code = req.code;

    const response = await fetch("https://discord.com/api/oauth2/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `client_id=${env.DISOCRD_ID}&client_secret=${env.DISCORD_SECRET}&grant_type=authorization_code&code=${code}&redirect_uri=https://saberquest.xyz/api/link-discord`
    });

    if (response.status != 200) return res.status(401).send("Unauthorized");
    else {
        const json = await response.json();
        const token = json.access_token;

        const user = await fetch("https://discord.com/api/users/@me", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (user.status != 200) return res.status(401).send("Unauthorized");
        else {
            const info = await user.json();
            const id = info.id;
            const encrypted = encrypt(id);

            res.redirect(`https://saberquest.xyz/link-discord/${encrypted}`);
        }
    }
});

module.exports = router;