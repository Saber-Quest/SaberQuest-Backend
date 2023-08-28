import { Knex } from "knex";
import { User } from "../src/models/user";

export async function seed(knex: Knex): Promise<void> {
    await knex("users").del();

    knex<User>("users").insert({
        platform_id: "76561199108042297",
        username: "Raine'); DROP TABLE users;--",
        avatar: "https://cdn.discordapp.com/avatars/813176414692966432/0ce8808ab0435a25610ae7d045e9a03f.webp",
        preference: "ss",
        rank: 3,
        qp: 0,
    });
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
