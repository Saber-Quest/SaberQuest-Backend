import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    await knex("users").del();

    await knex("users").insert([
        {
            id: "76561198410971373",
            username: "ACC | Sands",
            avatar: "https://saberquest.xyz/avatar/76561198410971373.png",
            banner: "https://saberquest.xyz/banner/76561198410971373.png",
            border: "https://saberquest.xyz/border/76561198410971373.png",
            preference: "ss",
            chistory: [],
            items: [],
            challengesCompleted: 14,
            rank: 1,
            qp: 28,
            value: 56,
            diff: 2,
            completed: true
        }, {
            id: "76561198343533017",
            username: "StormPacer",
            avatar: "https://saberquest.xyz/avatar/76561198343533017.png",
            banner: "https://saberquest.xyz/banner/76561198343533017.png",
            border: "https://saberquest.xyz/border/76561198343533017.png",
            preference: "bl",
            chistory: [],
            items: [],
            challengesCompleted: 0,
            rank: 2,
            qp: 0,
            value: 0,
            diff: 0,
            completed: false
        }
    ]);
};