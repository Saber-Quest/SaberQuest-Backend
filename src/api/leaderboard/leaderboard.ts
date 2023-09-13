import { GET } from "../../router";
import db from "../../db";
import { Request, Response } from "express";
import { User } from "../../models/user";
import { userRes } from "../../types/user";
import { ChallengeHistory } from "../../models/challengeHistory";

export class Leaderboard {
    /**
     * GET /leaderboard/{id}
     * @summary Get the leaderboard
     * @tags Leaderboard
     * @param {number} id.path.required - The page number
     * @return {object} 200 - Success
     * @return {string} 400 - Invalid ID
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
     * @example response - 400 - Invalid ID
     * {
     *   "error": "Invalid ID"
     * }
     * @example response - 500 - Internal server error
     * "Internal server error"
     */
    @GET("leaderboard/:id")
    async get(req: Request, res: Response) {
        const num: number = parseInt(req.params.id);

        if (isNaN(num)) {
            return res.status(400).json({ message: "Invalid ID" });
        }

        const users = await db<User>("users")
            .select("*")
            .where("rank", "<=", num * 10)
            .andWhere("rank", ">", (num - 1) * 10)
            .orderBy("rank", "asc")

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
                    preference: user.preference,
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