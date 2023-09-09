import type { Request, Response } from "express";
import { GET, PUT } from "../../router";
import db from "../../db";
import { User } from "../../models/user";
import { UserItem } from "../../models/userItem";
import fs from "fs";
import { Item } from "../../models/item";
import { userInventoryRes } from "../../types/user";
import { cache, setCache } from "../../functions/cache";

export class PlayerProfile {
    /**
     * GET /profile/{id}
     * @summary Get a player's profile
     * @tags users
     * @param {string} id.path.required - The id of the player
     * @return {object} 200 - Success
     * @return {object} 404 - User not found
     * @return {string} 500 - Internal server error
     * @example response - 200 - Success
     * {
     * "userInfo": {
     *  "platform_id": "76561199108042297",
     *  "username": "Raine'); DROP TABLE users;--",
     *  "images": {
     *   "avatar": "https://cdn.discordapp.com/avatars/813176414692966432/0ce8808ab0435a25610ae7d045e9a03f.webp",
     *   "banner": null,
     *   "border": null
     *  },
     *  "preference": "ss"
     * },
     * "stats": {
     *  "rank": 3,
     *  "qp": 0
     *  }
     * }
     * @example response - 404 - User not found
     * {
     * "message": "User not found."
     * }
     * @example response - 500 - Internal server error
     */
    @GET("profile/:id", cache)
    async get(req: Request, res: Response): Promise<void | Response> {
        if (!req.params.id) {
            return res.status(400).json({ message: "Missing fields" });
        }

        const id = req.params.id;

        setCache(req, `profile:${id}`)

        await db<User>("users")
            .select("*")
            .where("platform_id", id)
            .first()
            .then((user) => {
                if (!user) {
                    return res.status(404).json({ message: "User not found." });
                }

                const JsonResponse = {
                    userInfo: {
                        id: user.platform_id,
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
                return res.sendStatus(500);
            });
    }

    @GET("profile/:id/inventory", cache)
    async getPlayerInventory(req: Request, res: Response) {
        setCache(req, `profile:${req.params.id}`)

        try {
        const user = await db<User>("users")
            .select("id")
            .where("platform_id", req.params.id)
            .first();
        if (!user.id) {
            return res.status(404).json({ message: "User not found." });
        }

        const items = await db<UserItem>("user_items")
            .select("item_id", "amount")
            .where("user_id", user.id)

        const itemsArray: userInventoryRes[] = [];

        for (const item of items) {
            await db<Item>("items")
                .select("name_id", "image", "name")
                .where("id", item.item_id)
                .first()
                .then((itemData) => {
                    itemsArray.push({
                        id: itemData.name_id,
                        image: itemData.image,
                        name: itemData.name,
                        amount: item.amount,
                    });
                });
        }

        return res.status(200).json(itemsArray);
        } catch (err) {
            console.error(err);
            return res.sendStatus(500);
        }
    }

    /**
     * GET /profile/{id}/avatar
     * @summary Get a player's avatar
     * @tags users
     * @param {string} id.path.required - The id of the player
     * @return {image/png} 200 - Success
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
    @GET("profile/:id/avatar", cache)
    getPlayerAvatar(req: Request, res: Response): Response {
        const exists = fs.existsSync(`./data/avatars/${req.params.id}.png`);
        if (!exists) {
            return res.status(404).json({ message: "User not found." });
        }
        try {
            // @ts-ignore
            setCache(req, `profile:${req.params.id}`)

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
        if (userData.authorization_code !== process.env.AUTHORIZATION_CODE) {
            return res.sendStatus(403);
        }
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
