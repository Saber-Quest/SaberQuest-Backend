import { Request, Response } from "express";
import { GET } from "../../router";
import db from "../../db";
import { User } from "../../models/user";
import { UserItem } from "../../models/userItem";
import { userInventoryRes } from "../../types/user";
import { Item } from "../../models/item";
import { ChallengeHistory } from "../../models/challengeHistory";
import { ChallengeSet } from "../../models/challengeSet";
import { Difficulty } from "../../models/difficulty";
import { ChallengeHistoryResponse } from "../../types/challenges";
import { setCache } from "../../functions/cache";
import { verifyJWT } from "../../functions/users/jwtVerify";

enum DifficultyEnum {
    Normal = 1,
    Hard = 2,
    Expert = 3,
}

/**
 * GET /profile/{id}/advanced
 * @summary Get a player's advanced profile
 * @tags Users
 * @param {string} id.path.required - The id of the player
 * @return {object} 200 - Success
 * @return {string} 400 - Missing fields
 * @return {object} 404 - User not found
 * @return {string} 500 - Internal server error
 * @example response - 200 - Success
 * {
 *    "userInfo": {
 *        "id": "76561198343533017",
 *        "username": "StormPacer",
 *        "images": {
 *            "avatar": "http://localhost:3010/avatar/76561198343533017",
 *            "banner": null,
 *            "border": null
 *        },
 *        "preference": "bl",
 *        "patreon": null,
 *        "autoComplete": null
 *    },
 *    "stats": {
 *        "challengesCompleted": 4,
 *        "rank": 2,
 *        "qp": 14,
 *        "value": 32
 *    },
 *    "today": {
 *        "diff": 2,
 *        "completed": false
 *    },
 *    "inventory": [
 *        {
 *            "id": "bs",
 *            "image": "https://saberquest.xyz/images/blue_saber_icon.png",
 *            "name": "Blue Saber",
 *            "amount": 11
 *        },
 *        {
 *            "id": "bn",
 *            "image": "https://saberquest.xyz/images/blue_notes_icon.png",
 *            "name": "Blue Notes",
 *            "amount": 7
 *        }
 *    ],
 *    "challengeHistory": [
 *        {
 *            "date": "2023-09-16T12:14:20.553Z",
 *            "items": [
 *                {
 *                    "name": "CC Token",
 *                    "image": "https://saberquest.xyz/images/cube_community_token.png",
 *                    "rarity": "Legendary"
 *                },
 *                {
 *                    "name": "Red Notes",
 *                    "image": "https://saberquest.xyz/images/red_notes_icon.png",
 *                    "rarity": "Common"
 *                }
 *            ],
 *            "qp": 10,
 *            "challenge": {
 *                "name": "PP Challenge",
 *                "description": "Get a certain amount of PP on a single map.",
 *                "type": "pp",
 *                "difficulty": {
 *                    "name": "Hard",
 *                    "challenge": [
 *                        200,
 *                        250
 *                    ]
 *                }
 *            }
 *        },
 *        {
 *            "date": "2023-09-16T12:14:20.553Z",
 *            "items": [
 *                {
 *                    "name": "Blue Debris",
 *                    "image": "https://saberquest.xyz/images/blue_debris_icon.png",
 *                    "rarity": "Uncommon"
 *                },
 *                {
 *                    "name": "BSMG Token",
 *                    "image": "https://saberquest.xyz/images/bsmg_token.png",
 *                    "rarity": "Legendary"
 *                },
 *                {
 *                    "name": "Crouch Wall",
 *                    "image": "https://saberquest.xyz/images/crouch_wall_icon.png",
 *                    "rarity": "Rare"
 *                }
 *            ],
 *            "qp": 5,
 *            "challenge": {
 *                "name": "PP Challenge",
 *                "description": "Get a certain amount of PP on a single map.",
 *                "type": "pp",
 *                "difficulty": {
 *                    "name": "Normal",
 *                    "challenge": [
 *                        50,
 *                        70
 *                    ]
 *                }
 *            }
 *        },
 *        {
 *            "date": "2023-09-16T12:14:20.553Z",
 *            "items": [
 *                {
 *                    "name": "Bad Cut Notes",
 *                    "image": "https://saberquest.xyz/images/badcut_notes_icon.png",
 *                    "rarity": "Common"
 *                },
 *                {
 *                    "name": "Blue Note Pieces",
 *                    "image": "https://saberquest.xyz/images/blue_cube_pieces_icon.png",
 *                    "rarity": "Common"
 *                },
 *                {
 *                    "name": "Blue Notes",
 *                    "image": "https://saberquest.xyz/images/blue_notes_icon.png",
 *                    "rarity": "Common"
 *                }
 *            ],
 *            "qp": 15,
 *            "challenge": {
 *                "name": "PP Challenge",
 *                "description": "Get a certain amount of PP on a single map.",
 *                "type": "pp",
 *                "difficulty": {
 *                    "name": "Expert",
 *                    "challenge": [
 *                        400,
 *                        500
 *                    ]
 *                }
 *            }
 *        },
 *        {
 *            "date": "2023-09-16T12:14:20.553Z",
 *            "items": [
 *                {
 *                    "name": "Bad Cut Notes",
 *                    "image": "https://saberquest.xyz/images/badcut_notes_icon.png",
 *                    "rarity": "Common"
 *                },
 *                {
 *                    "name": "Blue Note Pieces",
 *                    "image": "https://saberquest.xyz/images/blue_cube_pieces_icon.png",
 *                    "rarity": "Common"
 *                },
 *                {
 *                    "name": "Blue Notes",
 *                    "image": "https://saberquest.xyz/images/blue_notes_icon.png",
 *                    "rarity": "Common"
 *                }
 *            ],
 *            "qp": 15,
 *            "challenge": {
 *                "name": "Play X Maps Challenge",
 *                "description": "Play a certain amount of maps.",
 *                "type": "map",
 *                "difficulty": {
 *                    "name": "Expert",
 *                    "challenge": [
 *                        15
 *                    ]
 *                }
 *            }
 *        }
 *    ]
 *}
 * @example response - 400 - Missing fields
 * {
 *   "error": "Missing fields"
 * }
 * @example response - 404 - User not found
 * {
 *  "error": "User not found."
 * }
 * @example response - 500 - Internal server error
 * "Internal server error"
 */

export class AdvancedPlayerProfile {
    @GET("profile/:id/advanced")
    async get(req: Request, res: Response): Promise<void | Response> {
        try {
            res.setHeader("Access-Control-Allow-Origin", "*");

            const token = req.query.code as unknown as boolean;

            let id = req.params.id;

            if (token) {
                const jwt = verifyJWT(req.headers.authorization.split(" ")[1]);

                if (!jwt || jwt.exp < Date.now() / 1000) {
                    return res.status(403).json({ message: "Forbidden" });
                }

                id = jwt.id;
            }

            if (!id) {
                return res.status(400).json({ error: "Missing fields" });
            }

            setCache(req, `profile:${id}`);

            const user = await db<User>("users")
                .select("*")
                .where("platform_id", id)
                .first();

            if (!user) {
                return res.status(404).json({ error: "User not found." });
            }

            let completed = false;

            const challenges = await db<ChallengeHistory>("challenge_histories")
                .select("*")
                .where("user_id", user.id)
                .orderBy("date", "desc")
                .limit(10);

            if (challenges.length > 0) {
                if (challenges[0].date.slice(0, 10) === new Date().toISOString().slice(0, 10)) {
                    completed = true;
                }
            }

            const challengeCount = challenges.length;

            const mappedChallenges = challenges.map(async (history: ChallengeHistory) => {
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
                        },
                        preference: history.preference
                    }
                };

                return response;
            });

            const challengeHistory = Promise.all(mappedChallenges);

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

            const JsonResponse = {
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
                    autoComplete: user.auto_complete
                },
                stats: {
                    challengesCompleted: challengeCount,
                    rank: user.rank,
                    qp: user.qp,
                    value: user.value
                },
                today: {
                    diff: user.diff,
                    completed: completed
                },
                inventory: itemsArray,
                challengeHistory: await challengeHistory
            };

            return res.status(200).json(JsonResponse);

        } catch (err) {
            console.error(err);
            return res.sendStatus(500);
        }
    }
}