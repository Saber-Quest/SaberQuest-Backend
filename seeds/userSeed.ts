import { Knex } from "knex";
import { Challenge } from "../src/models/challenge";
import { User } from "../src/models/user";

export async function seed(knex: Knex): Promise<void> {
    await knex("users").del();

    knex<User>("users").insert({
        steam_id: "76561199108042297",
        username: "Raine'); DROP TABLE users;--",
        avatar: "https://cdn.discordapp.com/avatars/813176414692966432/0ce8808ab0435a25610ae7d045e9a03f.webp",
        preference: "ss",
        items: [],
        rank: 3,
        qp: 0,
        value: 0,
        diff: 4,
        completed: false,
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
