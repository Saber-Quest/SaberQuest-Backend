const express = require('express');
const router = express.Router();
const User = require('../../models/user.js');
const { encrypt } = require('../../functions/encryption.js');
const io = require('../../websocket/websocket');

router.post('/', async (req, res) => {
    const id = req.id;
    const type = req.type;

    const user = await User.findOne({ id: id }).exec();

    if (type == "register") {
        if (!user) {
            const pref = req.pref;

            const encryptedId = encrypt(id).split(":")[1].substring(0, 10);

            const newUser = new User({
                userId: id,
                pref: pref,
                qp: 0,
                r: 0,
                cp: 0,
                value: 0,
                collectibles: [],
                "completed": null,
                "diff": null,
                oculus: encryptedId
            });

            newUser.save();

            io.emit("newUser", {
                userId: id,
                link: `https://saberquest.com/profile/${id}`
            });

            return res.status(200).json({
                message: 'User Created.',
                login: encryptedId
            });
        }

        else {
            return res.status(200).json({
                message: 'User Exists.',
                login: user.oculus
            });
        }
    }

    else {
        const user = await User.findOne({ oculus: id }).exec();

        if (user == null) {
            return res.status(200).json({
                message: 'User not found!'
            });
        }

        else {
            const encrypted = encrypt(user.userId);

            return res.status(200).json({
                message: "User fetched successfully!",
                user: encrypted
            });
        }
    }
});

module.exports = router;