import type { Request, Response } from "express";
import { GET, PUT } from "../../router";
import db from "../../db";
import { User } from "../../models/user";
import { UserItem } from "../../models/userItem";
import fs from "fs";

export class PlayerProfile {
    /**
     * GET /profile/{id}
     * @summary Get a player's profile
     * @tags users
     * @param {string} id.path.required - The id of the player
     * @return {object} 200 - Success
     * @return {object} 404 - User not found
     * @return {object} 500 - An error occurred
     * @example response - 200 - Success
     * {
     *  "userInfo": {
     *     "platform_id": "76561199108042297",
     *    "username": "Raine'); DROP TABLE users;--",
     *   "images": {
     *     "avatar": "https://cdn.discordapp.com/avatars/813176414692966432/0ce8808ab0435a25610ae7d045e9a03f.webp",
     *    "banner": null,
     *  "border": null
     * },
     * "preference": "ss"
     * },
     * "stats": {
     *  "rank": 3,
     * "qp": 0
     * }
     * }
     * @example response - 404 - User not found
     * {
     * "message": "User not found."
     * }
     * @example response - 500 - An error occurred
     * {
     * "message": "An error occurred, please try again later."
     * }
     */
    @GET("profile/:id")
    get(req: Request, res: Response) {
        db<User>("users")
            .select("*")
            .where("platform_id", req.params.id)
            .first()
            .then((user) => {
                if (!user) {
                    return res.status(404).json({ message: "User not found." });
                }

                const JsonResponse = {
                    userInfo: {
                        platform_id: user.platform_id,
                        username: user.username,
                        images: {
                            avatar: user.avatar,
                            banner: user.banner,
                            border: user.border,
                        },
                        preference: user.preference,
                    },
                    stats: {
                        rank: user.rank,
                        qp: user.qp,
                    },
                };
                return res.status(200).json(JsonResponse);
            })
            .catch((err) => {
                console.error(err);
                return res.status(500).json({
                    message: "An error occurred, please try again later.",
                });
            });
    }

    @GET("profile/:id/inventory")
    async getPlayerInventory(req: Request, res: Response) {
        const dbItems = await db<UserItem>("user_items")
            .select("item_id")
            .where("user_id", req.params.id);

        res.status(200).json(dbItems);
    }

    /**
     * GET /profile/{id}/avatar
     * @summary Get a player's avatar
     * @tags users
     * @param {string} id.path.required - The id of the player
     * @return {object} 200 - Success
     * @return {object} 404 - User not found
     * @return {object} 500 - An error occurred
     * @example response - 200 - Success
     * @example response - 404 - User not found
     * {
     * "message": "User not found."
     * }
     * @example response - 500 - An error occurred
     * {
     * "message": "An error occurred, please try again later."
     * }
     */
    @GET("profile/:id/avatar")
    getPlayerAvatar(req: Request, res: Response) {
        const exists = fs.existsSync(`./data/avatars/${req.params.id}.png`);
        if (!exists) return res.status(404).json({ message: "User not found." });
        try {
            const file = fs.readFileSync(`./data/avatars/${req.params.id}.png`);

            res.setHeader("Content-Type", "image/png");
            res.setHeader("Content-Length", file.length);
            res.status(200).end(file);
        } catch (err) {
            return res.status(500).json({
                message: "An error occurred, please try again later.",
            });
        }
    }

    /**
     * PUT /profile/create
     * @summary Create a player's profile
     * @tags users
     */
    @PUT("profile/create")
    async createUser(req: Request, res: Response) {
        const userData = req.body;
        if (userData.authorization_code !== process.env.AUTHORIZATION_CODE) return res.status(401).send("Invalid authorization code.");
        await db<User>("users")
            .insert({
                platform_id: userData.platform_id,
                username: userData.username,
                avatar: userData.avatar,
                banner: null,
                border: null,
                preference: userData.preference,
                rank: userData.rank,
                qp: 0,
            })
            .then(() => {
                res.sendStatus(200);
            })
            .catch((err) => {
                console.error(err);
                return res.status(500).json({
                    message: `An error occurred, did you include all the data?!`,
                });
            });
    }
}
