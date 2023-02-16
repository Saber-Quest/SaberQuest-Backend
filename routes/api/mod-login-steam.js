const express = require("express");
const router = express.Router();
const { User } = require("../../models/user");

router.post("/", async (req, res) => {
    const id = req.id;
    const pref = req.pref;
    const user = User.findOne({ userId: id }).exec();

    if (!user) {
        const newUser = new User({
            userId: id,
            pref: pref,
            r: 0,
            qp: 0,
            cp: 0,
            collectibles: [],
            value: 0,
            diff: 4,
            completed: false,
            oculus: null
        });

        await newUser.save();
    }

    else {
        return res.status(202).json({ message: "User already exists." })
    }
});