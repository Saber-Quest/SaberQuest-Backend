const querystring = require("querystring");
const express = require("express")
const { encrypt } = require("../../functions/encryption.js");
const router = express.Router();

router.get("/", async (req, res) => {
    const code = querystring.stringify({ code: req.code });
    const iss = req.iss;

    if (iss != "https://api.beatleader.xyz/") return res.status(401).send("Unauthorized");

    const secret = querystring.stringify({ client_secret: env.SABERQUEST_SECRET })
    const client_id = querystring.stringify({ client_id: env.SABERQUEST_ID })
    const redirect_uri = querystring.stringify({ redirect_uri: "https://saberquest.xyz/api/bl-login" })

    const response = await fetch("https://api.beatleader.xyz/oauth2/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `grant_type=authorization_code&${client_id}&${secret}&${code}&${redirect_uri}`
    }).then(res => res.json())

    const token = response.access_token;

    const user = await fetch("https://api.beatleader.xyz/oauth2/identity", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    })
    if (user.status != 200) return res.status(401).send("Unauthorized");
    else {
        const info = await user.json();
        const id = info.id;

        const encrypted = encrypt(id);

        res.redirect(`https://saberquest.xyz/profile#${encrypted}`);
    }
});

module.exports = router;