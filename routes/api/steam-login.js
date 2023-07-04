const express = require("express")
const router = express.Router();
const { encrypt } = require("../../functions/encryption.js");

router.get("/", async (req, res) => {
    const id = req.query['openid.identity'].split("/")[5];

    const encrypted = encrypt(id);

    res.redirect(`https://saberquest.xyz/profile#${encrypted}`);
});

module.exports = router;