import { Knex } from "knex";
import { ChallengeSet } from "../src/models/challengeSet";
import { Difficulty } from "../src/models/difficulty";
import { ChallengeHistory } from "../src/models/challengeHistory";
import { User } from "../src/models/user";
import { Item } from "../src/models/item";

export async function seed(knex: Knex): Promise<void> {
    await knex("difficulties").del();
    await knex("challenge_sets").del();
    await knex("challenge_histories").del();

    await knex<ChallengeSet>("challenge_sets").insert([
        {
            type: "pp",
            name: "PP Challenge",
            description: "Get a certain amount of PP on a single map."
        },
    ]);

    const challenge = await knex<ChallengeSet>("challenge_sets").select("*").first();

    await knex<Difficulty>("difficulties").insert([
        {
            challenge_id: challenge.id,
            challenge: [50, 70],
            diff: 1,
            color: "#FFD941"
        },
        {
            challenge_id: challenge.id,
            challenge: [200, 250],
            diff: 2,
            color: "#E93B3B"
        },
        {
            challenge_id: challenge.id,
            challenge: [400, 500],
            diff: 3,
            color: "#B74BF5"
        }
    ]);

    await knex<ChallengeHistory>("challenge_histories").insert([
        {
            challenge_id: challenge.id,
            date: new Date().toISOString(),
        }
    ]);

    const user = await knex<User>("users")
        .select("*")
        .where("platform_id", "76561198343533017")
        .first();

    const items = await knex<Item>("items").select("*");

    await knex<ChallengeHistory>("challenge_histories").insert([
        {
            user_id: user.id,
            challenge_id: challenge.id,
            date: new Date().toISOString(),
            item_ids: `${items[10].name_id},${items[15].name_id}`,
            difficulty: 2,
            qp: 10
        },
        {
            user_id: user.id,
            challenge_id: challenge.id,
            date: new Date().toISOString(),
            item_ids: `${items[3].name_id},${items[7].name_id},${items[9].name_id}`,
            difficulty: 1,
            qp: 5
        },
        {
            user_id: user.id,
            challenge_id: challenge.id,
            date: new Date().toISOString(),
            item_ids: `${items[1].name_id},${items[2].name_id},${items[4].name_id}`,
            difficulty: 3,
            qp: 15
        }
    ]);
}