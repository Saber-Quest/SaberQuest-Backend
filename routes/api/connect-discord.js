const express = require("express");
const router = express.Router();
const { decrypt } = require("../../functions/encryption.js");
const User = require("../../models/user.js");
const io = require("../../websocket/websocket.js");

router.post("/", async (req, res) => {
    const id = req.id;
    const token = req.token;
   
    if (!id) {
        res.status(400).send("No id provided");
    }

    if (!token) {
        res.status(400).send("No token provided");
    }

    const decryptedId = decrypt(id);

    const userId = decrypt(token);

    const user = await User.findOne({ userId: userId }).exec();

    if (!user) {
        return res.status(400).send("User not found");
    }

    if (user.discordId) {
        return res.status(400).send("User already connected");
    }

    await User.updateOne({ userId: userId }, { discordId: decryptedId });

    io.emit('discordConnect', { userId: userId, discordId: decryptedId });

    res.status(200).send("User updated successfully");
});

module.exports = router;