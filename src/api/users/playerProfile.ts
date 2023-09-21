import type { Request, Response } from "express";
import { GET, PUT } from "../../router";
import db from "../../db";
import { User } from "../../models/user";
import { UserItem } from "../../models/userItem";
import fs from "fs";
import { Item } from "../../models/item";
import { userInventoryRes, userRes } from "../../types/user";
import { cache, setCache } from "../../functions/cache";
import dotenv from "dotenv";
import { ChallengeHistory } from "../../models/challengeHistory";
dotenv.config();

export class PlayerProfile {
    /**
     * GET /profile/{id}
     * @summary Get a player's profile
     * @tags Users
     * @param {string} id.path.required - The id of the player
     * @return {object} 200 - Success
     * @return {object} 404 - User not found
     * @return {string} 500 - Internal server error
     * @example response - 200 - Success
     *{
     * "userInfo": {
     *     "id": "76561198343533017",
     *     "username": "StormPacer",
     *     "images": {
     *         "avatar": "https://api.saberquest.xyz/profile/76561198343533017/avatar",
     *         "banner": null,
     *         "border": null
     *     },
     *     "preference": "bl"
     * },
     * "stats": {
     *     "challengesCompleted": 4,
     *     "rank": 2,
     *     "qp": 10,
     *     "value": 41
     * },
     * "today": {
     *     "diff": 2,
     *     "completed": false
     * }
     *}
     * @example response - 404 - User not found
     * {
     * "message": "User not found."
     * }
     * @example response - 500 - Internal server error
     */
    @GET("profile/:id", cache)
    async get(req: Request, res: Response): Promise<void | Response> {
        try {
            res.setHeader("Access-Control-Allow-Origin", "*");

            const id = req.params.id;

            if (!id) {
                return res.status(400).json({ error: "Invalid request" });
            }

            setCache(req, `profile:${id}`);

            const user = await db<User>("users")
                .select("*")
                .where("platform_id", id)
                .first();

            if (!user) {
                return res.status(404).json({ message: "User not found." });
            }

            let completed = false;

            const challenges = await db<ChallengeHistory>("challenge_histories")
                .select("date")
                .where("user_id", user.id)
                .orderBy("date", "desc")
                .first();

            if (challenges.date.slice(0, 10) === new Date().toISOString().slice(0, 10)) {
                completed = true;
            }

            const challengeCount = await db<ChallengeHistory>("challenge_histories")
                .count("user_id as count")
                .where("user_id", user.id)
                .first();

            const object = challengeCount as unknown as { count: string };

            const JsonResponse: userRes = {
                userInfo: {
                    id: user.platform_id,
                    username: user.username,
                    images: {
                        avatar: user.avatar,
                        banner: user.banner,
                        border: user.border,
                    },
                    preference: user.preference,
                    patreon: user.patreon,
                    autoComplete: user.auto_complete
                },
                stats: {
                    challengesCompleted: parseInt(object.count),
                    rank: user.rank,
                    qp: user.qp,
                    value: user.value
                },
                today: {
                    diff: user.diff,
                    completed: completed
                }
            };

            return res.status(200).json(JsonResponse);

        } catch (err) {
            console.error(err);
            return res.sendStatus(500);
        }
    }

    /**
     * GET /profile/{id}/inventory
     * @summary Get a player's inventory
     * @tags Users
     * @param {string} id.path.required - The id of the player
     * @return {object} 200 - Success
     * @return {object} 404 - User not found
     * @return {string} 500 - An error occurred
     * @example response - 200 - Success
     *[
     *    {
     *        "id": "sp",
     *        "image": "https://saberquest.xyz/images/silver_pieces_icon.png",
     *        "name": "Silver Pieces",
     *        "amount": 1
     *    }
     *]
     * @example response - 404 - User not found
     * {
     * "message": "User not found."
     * }
     * @example response - 500 - An error occurred
     * "An error occurred, please try again later."
     */
    @GET("profile/:id/inventory")
    async getPlayerInventory(req: Request, res: Response) {
        try {
            res.setHeader("Access-Control-Allow-Origin", "*");

            const id = req.params.id;

            if (!id) {
                return res.status(400).json({ error: "Invalid request" });
            }

            setCache(req, `inventory:${id}`);

            const user = await db<User>("users")
                .select("id")
                .where("platform_id", id)
                .first();
            if (!user.id) {
                return res.status(404).json({ message: "User not found." });
            }

            const items = await db<UserItem>("user_items")
                .select("item_id", "amount")
                .where("user_id", user.id);

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
     * @tags Users
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
    @GET("profile/:id/avatar")
    getPlayerAvatar(req: Request, res: Response): Response {
        res.setHeader("Access-Control-Allow-Origin", "*");

        const id = req.params.id;
        let exists: boolean;

        if (process.env.NODE_ENV === "production") {
            exists = fs.existsSync(`./../../data/avatars/${id}.png`);
        }
        else {
            exists = fs.existsSync(`./data/avatars/${id}.png`);
        }

        if (!exists) {
            return res.status(404).json({ message: "User not found." });
        }
        try {
            let file: Buffer;

            if (process.env.NODE_ENV === "production") {
                file = fs.readFileSync(`./../../data/avatars/${id}.png`);
            }
            else {
                file = fs.readFileSync(`./data/avatars/${id}.png`);
            }

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
     * GET /profile/{id}/difficulty
     * @summary Get the player's selected difficulty
     * @tags Users
     * @param {string} id.path.required - The id of the player
     * @return {object} 200 - Success
     * @return {object} 404 - User not found
     * @return {string} 500 - Internal server error
     * @example response - 200 - Success
     * {
     * "difficulty": 1
     * }
     * @example response - 404 - User not found
     * {
     * "message": "User not found."
     * }
     * @example response - 500 - Internal server error
     * "Internal server error"
     */
    @GET("profile/:id/difficulty")
    async getPlayerDifficulty(req: Request, res: Response) {
        try {
            res.setHeader("Access-Control-Allow-Origin", "*");
            const user = await db<User>("users")
                .select("diff")
                .where("platform_id", req.params.id)
                .first();
            if (!user) {
                return res.status(404).json({ message: "User not found." });
            }
            return res.status(200).json({ difficulty: user.diff });
        } catch (err) {
            console.error(err);
            return res.sendStatus(500);
        }
    }

    /**
     * Create
     * @typedef {object} createUser
     * @property {string} authorization_code.required - The authorization code
     * @property {string} platform_id.required - The player's platform id
     * @property {string} username.required - The player's username
     * @property {string} avatar.required - The player's avatar
     * @property {string} preference.required - The player's preference
     * @property {number} rank.required - The player's rank
     */

    /**
     * PUT /profile/create
     * @summary Create a player's profile
     * @tags Users
     * @security BasicAuth
     * @param {createUser} request.body.required - The player's profile data
     * @return {object} 200 - Success
     * @return {string} 403 - Forbidden
     * @return {string} 500 - Internal server error
     * @example response - 200 - Success
     * @example response - 403 - Forbidden
     * "Forbidden"
     * @example response - 500 - Internal server error
     * "Internal server error"
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
                value: 0
            })
            .then(() => {
                res.sendStatus(200);
            })
            .catch((err) => {
                console.error(err);
                return res.sendStatus(500);
            });
    }
}
