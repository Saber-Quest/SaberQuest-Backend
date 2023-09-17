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

enum DifficultyEnum {
    Normal = 1,
    Hard = 2,
    Expert = 3,
}

export class AdvancedPlayerProfile {
    @GET("profile/:id/advanced")
    async get(req: Request, res: Response): Promise<void | Response> {
        try {
            res.setHeader("Access-Control-Allow-Origin", "*");
            if (!req.params.id) {
                return res.status(400).json({ message: "Missing fields" });
            }

            const id = req.params.id;

            const user = await db<User>("users")
                .select("*")
                .where("platform_id", id)
                .first();

            if (!user) {
                return res.status(404).json({ message: "User not found." });
            }

            let completed = false;

            const challenges = await db<ChallengeHistory>("challenge_histories")
                .select("*")
                .where("user_id", user.id)
                .orderBy("date", "desc")
                .limit(10);

            if (challenges[0].date.slice(0, 10) === new Date().toISOString().slice(0, 10)) {
                completed = true;
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
                        }
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