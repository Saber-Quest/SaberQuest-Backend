import { Item } from "../../models/item";
import { ChallengeSet } from "../../models/challengeSet";
import { Difficulty } from "../../models/difficulty";
import { ChallengeHistory } from "../../models/challengeHistory";
import type { Request, Response } from "express";
import db from "../../db";
import { GET } from "../../router";
import { cache, setCache } from "../../functions/cache";
import { User } from "../../models/user";
import { ChallengeHistoryResponse } from "../../types/challenges";

// 1 = normal, 2 = hard, 3 = expert
enum DifficultyEnum {
    Normal = 1,
    Hard = 2,
    Expert = 3,
}

export class ChallengeHistoryEndpoint {
    /**
     * GET /challenge/history/{id}
     * @summary Get a player's challenge history
     * @tags challenges
     * @param {string} id.path.required - The id of the player
     * @return {object} 200 - Success
     * @return {object} 404 - User not found
     * @return {string} 500 - Internal server error
     * @example response - 200 - Success
     * [
     * {
     * "date": "2023-09-09T10:28:17.290Z",
     * "items": [
     * {
     * "name": "CC Token",
     * "image": "https://saberquest.xyz/images/cube_community_token.png",
     * "rarity": "Legendary"
     * },
     * {
     * "name": "Red Notes",
     * "image": "https://saberquest.xyz/images/red_notes_icon.png",
     * "rarity": "Common"
     * }
     * ],
     * "qp": 10,
     * "challenge": {
     * "name": "PP Challenge",
     * "description": "Get a certain amount of PP on a single map.",
     * "type": "pp",
     * "difficulty": {
     * "name": "Hard",
     * "challenge": [200, 250]
     * }
     * }
     * }
     * ]
     * @example response - 200 - No challenge history
     * []
     * @example response - 404 - User not found
     * {
     * "error": "User not found"
     * }
     * @example response - 500 - Internal server error
     * "Internal server error"
     */
    @GET("challenge/history/:id", cache)
    async getChallengeHistoryId(req: Request, res: Response) {
        try {
            const id = req.params.id;

            const challengeHistory = await db<User>("users")
                .join("challenge_histories", "users.id", "=", "challenge_histories.user_id")
                .select("challenge_histories.*")
                .where("users.platform_id", id);

            if (challengeHistory.length === 0) {
                return res.status(200).json([]);
            }

            if (!challengeHistory) {
                return res.status(404).json({ error: "User not found" });
            }

            setCache(req, `profile:${id}`);

            const mapped = challengeHistory.map(async (history: ChallengeHistory) => {
                const items = history.item_ids.split(",");
                const itemsMap = items.map(async (item: string) => {
                    const itemObject = await db<Item>("items")
                        .select("*")
                        .where("name_id", item)
                        .first();

                    return {
                        name: itemObject.name,
                        image: itemObject.image,
                        rarity: itemObject.rarity
                    };
                });

                const arrayOfItems = await Promise.all(itemsMap);

                const challenge = await db<ChallengeSet>("challenge_sets")
                    .select("*")
                    .where("id", history.challenge_id)
                    .first();

                const difficulty = await db<Difficulty>("difficulties")
                    .select("*")
                    .where("challenge_id", history.challenge_id)
                    .andWhere("diff", history.difficulty)
                    .first();

                const response: ChallengeHistoryResponse = {
                    date: history.date,
                    items: arrayOfItems,
                    qp: history.qp,
                    challenge: {
                        name: challenge.name,
                        description: challenge.description,
                        type: challenge.type,
                        difficulty: {
                            name: DifficultyEnum[history.difficulty],
                            challenge: difficulty.challenge,
                        }
                    }
                };

                return response;
            });

            const response = await Promise.all(mapped);

            return res.status(200).json(response);
        } catch (err) {
            console.error(err);
            return res.sendStatus(500);
        }
    }
}
