import { Router } from "express";
const router = Router();
import { decrypt } from "../../functions/encryption";
import User from "../../models/user";
import io from "../../websocket/websocket";
import fs from "fs";
import { Readable } from "stream";
import { finished } from "stream/promises";

router.post("/:reason", async (req, res) => {
    const reason = req.params.reason;
    const data = req.headers.user;

    const decrypted = decrypt(String(data));

    if (decrypted == null) return res.status(401).json({
        message: "Something went wrong while decrypting the token."
    });

    switch (reason) {
        case "userLogin": {
            const user = await User.findOne({ userId: decrypted }).exec();

            if (user == null) {
                let hasBl = false;
                let hasSs = false;
                let username: string = "";
                let avatar: string = "";

                const beatleader = await fetch(`https://api.beatleader.xyz/player/${decrypted}`).then(res => res.json());
                if (beatleader.id != null) hasBl = true;
                const scoresaber = await fetch(`https://scoresaber.com/api/player/${decrypted}/basic`).then(res => res.json());
                if (!scoresaber.errorMessage) hasSs = true;

                let preference: string | undefined;

                if (hasBl) {
                    preference = "bl";
                    avatar = beatleader.avatar;
                    username = beatleader.name;
                } else if (hasSs) {
                    preference = "ss";
                    avatar = scoresaber.profilePicture;
                    username = scoresaber.name;
                } else {
                    preference = undefined;
                }

                if (preference == undefined) return res.status(401).json({
                    message: "User does not exist in any of the databases."
                });

                class CustomReadable extends Readable {
                    static fromWeb(webStream: any) {
                        return new Readable().wrap(webStream);
                    }
                }

                await fetch(avatar).then(async res => {
                    const body = CustomReadable.fromWeb(res.body);
                    const download = fs.createWriteStream(`./data/avatars/${decrypted}.png`);
                    await finished(body.pipe(download));
                });

                const newUser = new User({
                    userId: decrypted,
                    username: username,
                    avatar: `https://saberquest.xyz/avatar/${decrypted}.png`,
                    banner: null,
                    pref: preference,
                    qp: 0,
                    r: 0,
                    cp: 0,
                    value: 0,
                    collectibles: [],
                    completed: false,
                    diff: 4,
                    discordId: null
                });

                await newUser.save();

                const people = await User.find().exec();

                people.sort((a, b) => b.value - a.value);
                people.forEach((person, index) => {
                    person.r = index + 1;
                    person.save();
                });

                io.emit("newUser", {
                    userId: decrypted,
                    link: `https://saberquest.xyz/profile/${decrypted}`
                })
            }

            res.status(200).json({
                decryptedToken: decrypted
            });
        }
    }
});

export default router;