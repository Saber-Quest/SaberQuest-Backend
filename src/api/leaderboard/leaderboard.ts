import { GET } from "../../router";
import db from "../../db";
import { Request, Response } from "express";
import { User } from "../../models/user";
import { userRes } from "../../types/user";
import { ChallengeHistory } from "../../models/challengeHistory";
import { cache, setCache } from "../../functions/cache";

export class Leaderboard {
    /**
     * GET /leaderboard
     * @summary Get the leaderboard
     * @tags Leaderboard
     * @param {number} page.query.required - Page number
     * @param {number} limit.query.required - Number of users per page (max 50)
     * @return {object} 200 - Success
     * @return {object} 204 - No more users
     * @return {string} 400 - Invalid request
     * @return {string} 400 - Invalid page
     * @return {string} 400 - Invalid limit
     * @return {string} 500 - Internal server error
     * @example response - 200 - Success
     * {
     * "leaderboard": [
     *    {
     *        "userInfo": {
     *            "id": "76561198343533017",
     *            "username": "StormPacer",
     *            "images": {
     *                "avatar": "http://localhost:3010/avatar/76561198343533017",
     *                "banner": null,
     *                "border": null
     *            },
     *            "preference": "bl"
     *        },
     *        "stats": {
     *            "challengesCompleted": 4,
     *            "rank": 1,
     *            "qp": 0,
     *            "value": 10
     *        },
     *        "today": {
     *            "diff": 0,
     *            "completed": false
     *        }
     *    },
     *    {
     *        "userInfo": {
     *            "id": "76561199108042297",
     *            "username": "Raine'); DROP TABLE users;--",
     *            "images": {
     *                "avatar": "https://cdn.discordapp.com/avatars/813176414692966432/0ce8808ab0435a25610ae7d045e9a03f.webp",
     *                "banner": null,
     *                "border": null
     *            },
     *            "preference": "ss"
     *        },
     *        "stats": {
     *            "challengesCompleted": 2,
     *            "rank": 3,
     *            "qp": 0,
     *            "value": 3
     *        },
     *        "today": {
     *            "diff": 0,
     *            "completed": false
     *        }
     *    }
     * ]
     *}
     * @example response - 204 - No more users
     * {
     * "error": "No more users."
     * }
     * @example response - 400 - Invalid request
     * {
     *  "error": "Invalid request"
     * }
     * @example response - 400 - Invalid page
     * {
     * "error": "Invalid page"
     * }
     * @example response - 400 - Invalid limit
     * {
     * "error": "Invalid limit"
     * }
     * @example response - 500 - Internal server error
     * "Internal server error"
     */
    @GET("leaderboard", cache)
    async get(req: Request, res: Response) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        const page = Number(req.query.page);
        let limit = Number(req.query.limit);

        setCache(req, "leaderboard");

        if (isNaN(page) || isNaN(limit)) {
            return res.status(400).json({ error: "Invalid request" });
        }

        if (page < 1) {
            return res.status(400).json({ error: "Invalid page" });
        }

        if (limit < 1) {
            return res.status(400).json({ error: "Invalid limit" });
        }

        if (limit > 50) {
            limit = 50;
        }

        const users = await db<User>("users")
            .select("*")
            .where("rank", "<=", page * limit + 1)
            .andWhere("rank", ">", (page - 1) * limit + 1)
            .orderBy("rank", "asc");

        if (!users) {
            return res.status(204).json({ error: "No more users." });
        }

        const responseArray: userRes[] = [];

        for (const user of users) {
            const challengeCount = await db<ChallengeHistory>("challenge_histories")
                .count("user_id as count")
                .where("user_id", user.id)
                .first();

            const object = challengeCount as unknown as { count: string };

            responseArray.push({
                userInfo: {
                    id: user.platform_id,
                    username: user.username,
                    images: {
                        avatar: user.avatar,
                        banner: user.banner,
                        border: user.border,
                    },
                    patreon: user.patreon,
                    preference: user.preference,
                    autoComplete: user.auto_complete
                },
                stats: {
                    challengesCompleted: parseInt(object.count),
                    rank: user.rank,
                    qp: user.qp,
                    value: user.value
                },
                today: {
                    diff: 0,
                    completed: false
                }
            });
        }

        return res.status(200).json({ leaderboard: responseArray });
    }

    /**
     * GET /leaderboard/{id}
     * @summary Get the players around a user
     * @tags Leaderboard
     * @param {string} id.path.required - User's platform ID
     * @return {object} 200 - Success
     * @return {object} 404 - User not found
     * @return {string} 500 - Internal server error
     * @example response - 200 - Success
     * {
     * "leaderboard": [
     *    {
     *        "userInfo": {
     *            "id": "76561198343533017",
     *            "username": "StormPacer",
     *            "images": {
     *                "avatar": "http://localhost:3010/avatar/76561198343533017",
     *                "banner": null,
     *                "border": null
     *            },
     *            "preference": "bl"
     *        },
     *        "stats": {
     *            "challengesCompleted": 4,
     *            "rank": 1,
     *            "qp": 0,
     *            "value": 10
     *        },
     *        "today": {
     *            "diff": 0,
     *            "completed": false
     *        }
     *    },
     *    {
     *        "userInfo": {
     *            "id": "76561199108042297",
     *            "username": "Raine'); DROP TABLE users;--",
     *            "images": {
     *                "avatar": "https://cdn.discordapp.com/avatars/813176414692966432/0ce8808ab0435a25610ae7d045e9a03f.webp",
     *                "banner": null,
     *                "border": null
     *            },
     *            "preference": "ss"
     *        },
     *        "stats": {
     *            "challengesCompleted": 2,
     *            "rank": 3,
     *            "qp": 0,
     *            "value": 3
     *        },
     *        "today": {
     *            "diff": 0,
     *            "completed": false
     *        }
     *    }
     * ]
     *}
     * @example response - 404 - User not found
     * {
     *  "error": "User not found"
     * }
     * @example response - 500 - Internal server error
     * "Internal server error"
     */
    @GET("leaderboard/:id")
    async getAroundUser(req: Request, res: Response) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        const id = req.params.id;

        if (!id) {
            return res.status(400).json({ error: "Invalid request" });
        }

        setCache(req, "leaderboard");

        const rank = await db<User>("users")
            .select("rank")
            .where("platform_id", id)
            .first();

        if (!rank) {
            return res.status(404).json({ error: "User not found" });
        }

        const users = await db<User>("users")
            .select("*")
            .where("rank", "<=", rank.rank + 4)
            .andWhere("rank", ">=", rank.rank - 5)
            .orderBy("rank", "asc");

        const responseArray: userRes[] = [];

        for (const user of users) {
            const challengeCount = await db<ChallengeHistory>("challenge_histories")
                .count("user_id as count")
                .where("user_id", user.id)
                .first();

            const object = challengeCount as unknown as { count: string };

            responseArray.push({
                userInfo: {
                    id: user.platform_id,
                    username: user.username,
                    images: {
                        avatar: user.avatar,
                        banner: user.banner,
                        border: user.border,
                    },
                    patreon: user.patreon,
                    preference: user.preference,
                    autoComplete: user.auto_complete
                },
                stats: {
                    challengesCompleted: parseInt(object.count),
                    rank: user.rank,
                    qp: user.qp,
                    value: user.value
                },
                today: {
                    diff: 0,
                    completed: false
                }
            });
        }

        return res.status(200).json({ leaderboard: responseArray });
    }
}