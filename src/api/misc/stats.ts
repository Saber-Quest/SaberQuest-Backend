import { GET } from "../../router";
import { Request, Response } from "express";
import db from "../../db";
import { User } from "../../models/user";
import { ChallengeHistory } from "../../models/challengeHistory";
import { Item } from "../../models/item";
import { statsRes } from "../../types/statsRes";
import { UserItem } from "../../models/userItem";
import { cache } from "../../functions/cache";

export class Stats {
    @GET("stats")
    async get(req: Request, res: Response) {
        const users = await db<User>("users")
            .count("id as count")

        const modUsers = await db<User>("users")
            .count("id as count")
            .where("mod", true)

        const challenges = await db<ChallengeHistory>("challenge_histories")
            .count("challenge_id as count")
            .where("user_id", null)

        const challengesCompleted = await db<ChallengeHistory>("challenge_histories")
            .count("challenge_id as count")
            .not.where("user_id", null)

        const items = await db<Item>("items")
            .count("id as count")

        const totalQp = await db<User>("users")
            .sum("qp as count")

        const itemsOwned = await db<UserItem>("user_items")
            .count("item_id as count")

        const itemByRarity = await db<Item>("items")
            .select("rarity")
            .count("rarity as count")
            .groupBy("rarity")

        const preferences = await db<User>("users")
            .select("preference")
            .count("preference as count")
            .groupBy("preference")

        const object = users as unknown as { count: string }[];
        const object2 = modUsers as unknown as { count: string }[];
        const object3 = challenges as unknown as { count: string }[];
        const object4 = challengesCompleted as unknown as { count: string }[];
        const object5 = items as unknown as { count: string }[];
        const object6 = totalQp as unknown as { count: string }[];
        const object7 = itemsOwned as unknown as { count: string }[];
        const object8 = itemByRarity as unknown as { rarity: string, count: string }[];
        const object9 = preferences as unknown as { preference: string, count: string }[];

        const JsonResponse: statsRes = {
            users: {
                total: parseInt(object[0].count),
                modUsers: parseInt(object2[0].count),
                preferences: {
                    BeatLeader: parseInt(object9[0].count),
                    ScoreSaber: parseInt(object9[1].count),
                },
                totalQp: parseInt(object6[0].count),
            },
            challenges: {
                total: parseInt(object3[0].count),
                totalCompleted: parseInt(object4[0].count),
            },
            items: {
                total: parseInt(object5[0].count),
                totalOwned: parseInt(object7[0].count),
                byRarity: {
                    common: parseInt(object8[0].count),
                    uncommon: parseInt(object8[1].count),
                    rare: parseInt(object8[2].count),
                    epic: parseInt(object8[3].count),
                    legendary: parseInt(object8[4].count),
                },
            },
        };

        return res.status(200).json(JsonResponse);
    }
}