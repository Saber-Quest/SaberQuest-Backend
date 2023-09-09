import { Knex } from "knex";
import { User } from "../src/models/user";

export async function seed(knex: Knex): Promise<void> {
    await knex("users").del();

    await knex<User>("users").insert([
        {
            platform_id: "76561199108042297",
            username: "Raine'); DROP TABLE users;--",
            avatar: "https://cdn.discordapp.com/avatars/813176414692966432/0ce8808ab0435a25610ae7d045e9a03f.webp",
            preference: "ss",
            rank: 3,
            qp: 0,
        },
        {
            platform_id: "76561198343533017",
            username: "StormPacer",
            avatar: "http://localhost:3010/avatar/76561198343533017",
            preference: "bl",
            rank: 2,
            qp: 0,
        }
    ]);
}

// id: string;
// steam_id: string;
// username: string;
// avatar: string;
// banner: string;
// border: string;
// preference: string;
// challenge_history_id: string;
// challenge_history: ChallengeHistory;
// items: string[];
// challenges_completed: number;
// rank: number;
// qp: number;
// value: number;
// diff: number;
// completed: boolean;
