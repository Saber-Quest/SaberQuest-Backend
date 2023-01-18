const express = require("express")
const router = express.Router();
const { encrypt } = require("../../functions/encryption.js");

router.post("/", async (req, res) => {
    const reason = req.reason
    const { data } = req.query;

    const encrypted = encrypt(data);

    switch (reason) {
        case "userId": {
            const allowed_users = ["366210991735701505", "482507481663275009"];

            if (allowed_users.includes(data)) {
                res.status(200).json({
                    message: "User is allowed to use the API",
                    encrypted: encrypted
                });
            }

            else {
                res.status(401).json({
                    message: "error",
                    message: "User is not allowed to use the API"
                });
            }
        }
    }
});

module.exports = router;