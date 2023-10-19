import type { Request, Response } from "express";
import { GET } from "../../router";
import db from "../../db";
import { User } from "../../models/user";
import { UserItem } from "../../models/userItem";
import { verifyJWT } from "../../functions/users/jwtVerify";
import { Item } from "../../models/item";
import { userInventoryRes, userRes } from "../../types/user";
import dotenv from "dotenv";
import { ChallengeHistory } from "../../models/challengeHistory";
dotenv.config();

export class PlayerProfile {
    /**
     * GET /profile/{id}
     * @summary Get a player's profile
     * @tags Mod
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
    @GET("profile/mod")
    async get(req: Request, res: Response): Promise<void | Response> {
        try {
            res.setHeader("Access-Control-Allow-Origin", "*");

            const jwt = verifyJWT(req.headers.authorization.split(" ")[1]);

            if (!jwt || jwt.exp < Date.now() / 1000) {
                return res.status(403).json({ message: "Forbidden" });
            }

            const id = jwt.id;

            if (!id) {
                return res.status(400).json({ error: "Invalid request" });
            }

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

            if (!challenges) {
                completed = false;
            } else {
                if (challenges.date.slice(0, 10) === new Date().toISOString().slice(0, 10)) {
                    completed = true;
                }
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
                    about: user.about,
                    images: {
                        avatar: user.avatar,
                        banner: user.banner,
                        border: user.border,
                    },
                    preference: user.preference,
                    patreon: user.patreon,
                    autoComplete: user.auto_complete,
                    banned: user.banned
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
     * @tags Mod
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
    @GET("profile/mod/inventory")
    async getPlayerInventory(req: Request, res: Response) {
        try {
            res.setHeader("Access-Control-Allow-Origin", "*");

            const jwt = verifyJWT(req.headers.authorization.split(" ")[1]);

            if (!jwt || jwt.exp < Date.now() / 1000) {
                return res.status(403).json({ message: "Forbidden" });
            }

            const id = jwt.id;

            if (!id) {
                return res.status(400).json({ error: "Invalid request" });
            }

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
                    .select("name_id", "image", "name", "rarity")
                    .where("id", item.item_id)
                    .first()
                    .then((itemData) => {
                        itemsArray.push({
                            id: itemData.name_id,
                            image: itemData.image,
                            name: itemData.name,
                            rarity: itemData.rarity,
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
     * GET /profile/{id}/difficulty
     * @summary Get the player's selected difficulty
     * @tags Mod
     * @return {object} 200 - Success
     * @return {object} 400 - Invalid request
     * @return {object} 404 - User not found
     * @return {string} 500 - Internal server error
     * @example response - 200 - Success
     * {
     * "difficulty": 1
     * }
     * @example response - 400 - Invalid request
     * {
     * "error": "Invalid request"
     * }
     * @example response - 404 - User not found
     * {
     * "error": "User not found."
     * }
     * @example response - 500 - Internal server error
     * "Internal server error"
     */
    @GET("profile/mod/difficulty")
    async getPlayerDifficulty(req: Request, res: Response) {
        try {
            res.setHeader("Access-Control-Allow-Origin", "*");

            const jwt = verifyJWT(req.headers.authorization.split(" ")[1]);

            if (!jwt || jwt.exp < Date.now() / 1000) {
                return res.status(403).json({ message: "Forbidden" });
            }

            const id = jwt.id;

            if (!id) {
                return res.status(400).json({ error: "Invalid request" });
            }

            const user = await db<User>("users")
                .select("diff")
                .where("platform_id", id)
                .first();
            if (!user) {
                return res.status(404).json({ error: "User not found." });
            }
            return res.status(200).json({ difficulty: user.diff });
        } catch (err) {
            console.error(err);
            return res.sendStatus(500);
        }
    }
}
