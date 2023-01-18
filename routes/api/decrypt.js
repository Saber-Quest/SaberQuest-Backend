const express = require("express")
const router = express.Router();
const { decrypt } = require("../../functions/encryption.js");
const User = require("../../models/User");

router.post("/", async (req, res) => {
    const reason = req.reason;
    const data = req.headers.user;

    const decrypted = decrypt(data);

    switch (reason) {
        case "userId": {
            const allowed_users = ["366210991735701505", "482507481663275009"];

            if (allowed_users.includes(decrypted)) {
                res.status(200).json({
                    message: "User is allowed to use the API"
                });
            }

            else {
                res.status(401).json({
                    message: "error",
                });
            }
        }
            break;
        case "userLogin": {
            const user = await User.findOne({ userId: decrypted }).exec();

            if (user == null) {

                const newUser = new User({
                    userId: decrypted,
                    pref: "ss",
                    qp: 0,
                    r: 0,
                    cp: 0,
                    value: 0,
                    collectibles: [],
                    "completed": null,
                    "diff": null
                });

                await newUser.save();
            }

            res.status(200).json({
                decryptedToken: decrypted
            });
        }
    }
});

module.exports = router;